package com.se.backend.service.business;


import com.nimbusds.jose.util.Pair;
import com.se.backend.dto.request.*;
import com.se.backend.dto.response.*;
import com.se.backend.entity.*;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.mapper.AttributeMapper;
import com.se.backend.mapper.DeliveryInforInOrderMapper;
import com.se.backend.mapper.OrderMapper;
import com.se.backend.mapper.ProductInOrderMapper;
import com.se.backend.repository.*;
import com.se.backend.service.CartService;
import com.se.backend.service.payment.PaymentService;
import com.se.backend.service.storage.FileService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService  {
    @Autowired
    private final OrderRepository orderRepository;
    @Autowired
    private final AttributeMapper attributeMapper;
    @Autowired
    private final OrderMapper orderMapper;
    @Autowired
    private  final DeliveryInforInOrderMapper deliveryInforInOrderMapper;
    @Autowired
    private  final ProductInOrderMapper productInOrderMapper;
    @Autowired
    private final BuyerRepository buyerRepository;
    @Autowired
    private  final SellerRepository sellerRepository;
    @Autowired
    private final ProductInstanceRepository productInstanceRepository;
    @Autowired
    private final ProductRepository productRepository;
    @Autowired
    private final PaymentOrderRepository paymentOrderRepository;
    @Autowired
    private final Order_ProductInstanceRepository orderProductInstanceRepository;
    @Autowired
    private final DeliveryInfoRepository deliveryInfoRepository;
    @Autowired
    private final DeliveryRepository deliveryRepository;
    @Autowired
    private final AttributeInsRepository attributeInsRepository;
    @Autowired
    private final AttributeRepository attributeRepository;
    @Autowired
    private final DeliveryDateApiService deliveryDateApiService;
    @Autowired
    private final ShopPolicyRepository shopPolicyRepository;
    @Autowired
    private final CategoryPolicyRepository categoryPolicyRepository;
    private final FileInfoRepo fileInfoRepo;
    private final FileService fileService;
    private final CartService cartService;
	@Autowired
	private PaymentService paymentService;

    public void handleRemoveProductFromCart(String username, List<Product_of_OrderRequest> ListProduct) {
        //Handle remove in cart
        for(Product_of_OrderRequest product : ListProduct){
            cartService.removeProductInsFromCart(username, product.getInstantId());
        }
    }
    @Transactional
    public CreateOrderResponse create(CreateOrderRequest createOrderRequest){
        long addressId;
        try{
            addressId = Long.parseLong(createOrderRequest.getDeliveryAddress().getId());
        }
        catch(NullPointerException e){
            throw new WebServerException(ErrorCode.DELIVERY_INFOR_NOT_EXIST);
        }
        //Delivery
        DeliveryInfor deliveryInfor = deliveryInfoRepository.findById(addressId)
                .orElseThrow(()-> new WebServerException(ErrorCode.DELIVERY_INFOR_NOT_FOUND));

        //Create payment Order
        String username;
        try{
            username = createOrderRequest.getUsername();
        }
        catch (NullPointerException e){
            throw new WebServerException(ErrorCode.USER_NOT_EXIST);
        }
        Buyer buyer = buyerRepository.findByUsername(username)
                .orElseThrow(() -> new WebServerException(ErrorCode.USER_NOT_FOUND));
        PaymentOrder paymentOrder = new PaymentOrder();

        if(!deliveryInfor.getBuyer().equals(buyer)){
            return CreateOrderResponse.builder()
                    .msg("address of buyer does not exist").build();
        }

        paymentOrder.setDeliveryInfor(deliveryInfor);
        paymentOrder.setOrder(new ArrayList<>());
        paymentOrder.setReview(new ArrayList<>());
        boolean isCod = createOrderRequest.getMethod().equals("COD");
        long totalPay = 0;
        paymentOrder.setPayment_method(createOrderRequest.getMethod());
        paymentOrder.setIsCOD(isCod);
        paymentOrderRepository.save(paymentOrder);
        //----------------------

        //Create List Product for each Seller;
        Map<String, List<Order_ProductInstance>> sellerOrderMap = new HashMap<>();
        for (int i = 0; i < createOrderRequest.getListProduct().size(); i++) {
            String productId = createOrderRequest.getListProduct().get(i).getProductId();
            String productInstanceId = createOrderRequest.getListProduct().get(i).getInstantId();
            Long quantity = createOrderRequest.getListProduct().get(i).getQuantity();

            // Tìm sản phẩm
            ProductInstance productInstance = productInstanceRepository.findById(productInstanceId)
                    .orElseThrow(() -> new WebServerException(ErrorCode.PRODUCT_NOT_FOUND));

            // Kiểm tra số lượng trong kho
            if (productInstance.getQuantityInStock() < quantity) {
                return CreateOrderResponse.builder()
                        .msg("out of quantity in stock").build();
//                throw new WebServerException(ErrorCode.INSUFFICIENT_STOCK);
            }

            // Lấy seller của sản phẩm
            Product product = productRepository.findProductById(productId);
            String sellerId = product.getSeller().getUsername();

            // Tạo đối tượng Order_ProductInstance
            Order_ProductInstanceId orderProductInstanceId = new Order_ProductInstanceId();
            orderProductInstanceId.setProductInstanceId(productInstanceId);

            Order_ProductInstance orderProductInstance = Order_ProductInstance.builder()
                    .order_productInstanceId(orderProductInstanceId)
                    .quantity(quantity)
                    .productInstance(productInstance)
                    .build();

            // Thêm sản phẩm vào danh sách tương ứng với seller
            sellerOrderMap.computeIfAbsent(sellerId, k -> new ArrayList<>()).add(orderProductInstance);
        }
        //---------------------------------------------------------------------

        //Create Order
        List<Order_ProductInstance> orderProducts = new ArrayList<>();
        for (Map.Entry<String, List<Order_ProductInstance>> entry : sellerOrderMap.entrySet()){
            Seller seller = sellerRepository.findById(entry.getKey())
                    .orElseThrow(() -> new WebServerException(ErrorCode.USER_NOT_FOUND));
            Order order = new Order();
            order.setStatus("WAITING");
            order.setSeller(seller);
            order.setPaymentOrder(paymentOrder);
            try {
                orderRepository.save(order);
            }catch (WebServerException e){
                throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
            }

            double totalPrice = 0.0;

            for (int i = 0;  i < entry.getValue().size(); i++) {
                Order_ProductInstance orderProductInstance = entry.getValue().get(i);
                orderProductInstance.getOrder_productInstanceId().setOrderId(order.getOrderId());
                orderProductInstance.setOrder(order);
                Long quantity = entry.getValue().get(i).getQuantity();
                ProductInstance productInstance = orderProductInstance.getProductInstance();
                Product product = productInstance.getBuildProduct().get(0).getProduct();
                orderProducts.add(orderProductInstance);

                // Handle Sale here
                List<ShopPolicy> shopPolicy = shopPolicyRepository.findBySellerId(product.getSeller().getUsername());
                shopPolicy.sort(Comparator.comparing(ShopPolicy::getSale).reversed());
                List<CategoryPolicy> categoryPolicy = categoryPolicyRepository.findCategoryId(product.getCategory().getRichTextName());
                categoryPolicy.sort(Comparator.comparing(CategoryPolicy::getSale).reversed());
                Double shopSale = 0.0;
                Double cateSale = 0.0;
                for (ShopPolicy shop: shopPolicy){
                    if(shop.getCount() > 0){
                        shopSale = shop.getSale();
                        shop.setCount(shop.getCount() - 1);
                        try {
                            shopPolicyRepository.save(shop);
                        } catch (WebServerException e){
                            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
                        }
                        break;
                    }
                }
                for (CategoryPolicy cate: categoryPolicy){
                    if(cate.getSale() > cateSale && cate.getCount() > 0 ){
                        cateSale = cate.getSale();
                        cate.setCount(cate.getCount() - 1);
                        try {
                            categoryPolicyRepository.save(cate);
                        } catch (WebServerException e){
                            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
                        }
                        break;
                    }
                }
                double totalSale = shopSale + cateSale;
                totalSale = totalSale > 1 ? 1 : totalSale;

                //-----------------
                totalPrice += productInstance.getPrice() * quantity * (1 - totalSale);

            }
            order.setOrderProductInstances(orderProducts);
            FakeAPIDeliveryResponse deliveryResponse = deliveryDateApiService.fakeAPIDelivery(order);
            Delivery delivery = deliveryRepository.findById(deliveryResponse.getDeliveryName())
                    .orElseThrow(()->new WebServerException(ErrorCode.UNKNOWN_ERROR));
            order.setDelivery(delivery);
            order.setDeliveryCode(deliveryResponse.getDeliveryCode());
            order.setDeliveryDate(deliveryResponse.getDeliveryDate());
            order.setDeliveryJoinDate(deliveryResponse.getDeliveryJoinDate());
            order.setExpectedDeliveryDate(deliveryResponse.getExpectedDeliveryDate());
            order.setDeliveryStatus(deliveryResponse.getDeliveryStatus());
            order.setTotalPrice(totalPrice);
            order.setDelieryFee((double) createOrderRequest.getFakeShippingFee());
            try {
                orderRepository.save(order);
                for(Order_ProductInstance e: orderProducts){
                    ProductInstance updateProduct = e.getProductInstance();
                    Long oldQuantity = e.getProductInstance().getQuantityInStock();
                    Long newQuantity = e.getQuantity();
                    updateProduct.setQuantityInStock(oldQuantity - newQuantity);
                    productInstanceRepository.save(updateProduct);
                }
            }catch (WebServerException e){
                throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
            }
            paymentOrder.getOrder().add(order);
            // add price of order to total pay for create payment if it not cod payment
            if(!isCod) {
                totalPay += (order.getTotalPrice().longValue() +  order.getDelieryFee().longValue());
            }
        }
        long paymentOrderCode = paymentOrderRepository.save(paymentOrder).getPaymentOrderCode();
        if (!isCod) {
            try {
                String url = paymentService.createPaymentOrder((int) paymentOrderCode, (int) totalPay, "Payment for order", createItem(orderProducts), username);
                log.info("url {}", url);
                CreateOrderResponse response = CreateOrderResponse.builder().msg("successful").url(url).build();
                return response;
            } catch (Exception e) {
                log.error("Error while creating payment order", e);
                CreateOrderResponse response = CreateOrderResponse.builder().msg("Error while creating payment order").build();
                return response;
            }
        }
        CreateOrderResponse response = CreateOrderResponse.builder()
                .msg("successful")
                .payment_method(createOrderRequest.getMethod())
                .build();
        // Tạo phản hồi OrderResponse
        return response;
    }
    private JSONObject[] createItem(List<Order_ProductInstance> orderProductInstances) {
        JSONObject[] item = new JSONObject[orderProductInstances.size()];
        for (int i = 0; i < orderProductInstances.size(); i++) {
            Order_ProductInstance orderProductInstance = orderProductInstances.get(i);
            ProductInstance productInstance = orderProductInstance.getProductInstance();
            JSONObject itemObject = new JSONObject();
            itemObject.put("itemid", productInstance.getId());
            itemObject.put("itemprice", productInstance.getPrice());
            itemObject.put("itemquantity", orderProductInstance.getQuantity());
            item[i] = itemObject;
        }
        return item;
    }
    @Transactional
    public String addProductToOrder(String orderId, AddProductRequest addProductRequest) {

            //Find Order//HERE
        Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new WebServerException(ErrorCode.UNKNOWN_ERROR));
        Double newPrice = 0.0;
        // if state of order is not "WAITING" then throw "State of order does not allow to add product"
        if(!order.getStatus().equals("WAITING")){
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }
            //Find Product//HERE
        ProductInstance productInstance =productInstanceRepository.findById(addProductRequest.getProductId())
                    .orElseThrow(() -> new WebServerException(ErrorCode.UNKNOWN_ERROR));
        if(productInstance.getBuildProduct().getFirst().getProduct().getSeller() != order.getSeller()){
            return "Can not add product because it does not belong to " + order.getSeller().getShopName();
        }
        if (productInstance.getQuantityInStock() < addProductRequest.getQuantity()) {
            throw new WebServerException(ErrorCode.INSUFFICIENT_STOCK);
        }
        Optional<Order_ProductInstance> existingProduct = order.getOrderProductInstances().stream()
                .filter(op -> op.getProductInstance().getId().equals(productInstance.getId()))
                .findFirst();

        if (existingProduct.isPresent()) {
            // Nếu sản phẩm đã có, cập nhật số lượng
            existingProduct.get().setQuantity(existingProduct.get().getQuantity() + addProductRequest.getQuantity());
        }
        else {
            // Nếu chưa có, tạo mới Order_Product
            Order_ProductInstanceId orderProductInstanceId = Order_ProductInstanceId.builder()
                    .productInstanceId(productInstance.getId())
                    .orderId(orderId)
                    .build();
            Order_ProductInstance orderProductInstance = Order_ProductInstance.builder()
                    .order_productInstanceId(orderProductInstanceId)
                    .quantity(addProductRequest.getQuantity())
                    .productInstance(productInstance)
                    .order(order)
                    .build();
            order.getOrderProductInstances().add(orderProductInstance);
        }

        newPrice = order.getTotalPrice() + productInstance.getPrice() * addProductRequest.getQuantity();
        order.setTotalPrice(newPrice);
        try{
            orderRepository.save(order);
            return "Add product successfully";
        }
        catch (WebServerException e){//
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }
    }


    private GetOrderResponse OrderResponseHandler(Order order, List<ProductInstance> productInstanceList){
        GetOrderResponse result = orderMapper.OrderToResponse(order);
        Double totalPrice = order.getTotalPrice();

        DeliveryInfor deliveryInfor = order.getPaymentOrder().getDeliveryInfor();
        result.setDeliveryAddress(deliveryInforInOrderMapper.toDeliveryInforInOrder(deliveryInfor));
        String method = order.getPaymentOrder().getPayment_method();
        Boolean isCOD = order.getPaymentOrder().getIsCOD();
        List<Product_of_GetOrderResponse> product_of_getOrderResponseList = new ArrayList<>();

        List<Long> quantityOfProduct = new ArrayList<>();
        for(Order_ProductInstance op : order.getOrderProductInstances()){
            quantityOfProduct.add(op.getQuantity());
        }

        for(ProductInstance productInstance: productInstanceList){
            Product_of_GetOrderResponse product = productInOrderMapper.toProductDetail(productInstance);
            Product p = productRepository.findProductById(productInstance.getBuildProduct().getFirst().getId().getProductId());
            product.setId(p.getId());
            List<ShopPolicy> shopPolicy = shopPolicyRepository.findBySellerId(p.getSeller().getUsername());
            shopPolicy.sort(Comparator.comparing(ShopPolicy::getSale).reversed());
            List<CategoryPolicy> categoryPolicy = categoryPolicyRepository.findCategoryId(p.getCategory().getRichTextName());
            categoryPolicy.sort(Comparator.comparing(CategoryPolicy::getSale).reversed());
            Double shopSale = 0.0;
            Double cateSale = 0.0;
            for (ShopPolicy shop: shopPolicy){
                if(shop.getCount() > 0){
                    shopSale = shop.getSale();
                    break;
                }
            }
            for (CategoryPolicy cate: categoryPolicy){
                if(cate.getSale() > cateSale && cate.getCount() > 0 ){
                    cateSale = cate.getSale();
                    break;
                }
            }
            double totalSale = shopSale + cateSale;
            totalSale = totalSale > 1 ? 1 : totalSale;

            product.setSale(totalSale);

            String productName = p.getName();

            FileInfo fileInfo = fileInfoRepo.findFileInfoByProduct(p).getFirst();
            String path = fileService.downloadFile(fileInfo).getBody();
            product.setFirstImage(path);

            List<Attr_of_GetOrderResponse> attrOfGetOrderResponseList = new ArrayList<>();
//          ------------------------------------------------------------------
            List<Attribute> attributeList = attributeRepository.findByOfProduct(p);
            List<AttributeInstance> attributeInstanceList = attributeInsRepository.findAttributeInstancesBy(productInstance);
//            AttributeInstance attributeInstance = attributeInsRepository.findById(
//                    productInstance.getBuildProduct().getId().getAttributeInstanceId())
//                    .orElseThrow(()-> new WebServerException(ErrorCode.UNKNOWN_ERROR));
//            Attribute attribute = attributeRepository.getAttributesById(
//                    productInstance.getBuildProduct().getId().getAttributeInstanceId().getAttributeId());
            Map<Long, Attribute> attributeMap = attributeList.stream()
                    .collect(Collectors.toMap(Attribute::getId, attribute -> attribute));

            // Tạo danh sách các cặp Attribute và AttributeInstance
            List<Pair<Attribute, AttributeInstance>> matchedPairs = attributeInstanceList.stream()
                    .filter(attributeInstance -> attributeMap.containsKey(attributeInstance.getAttribute().getId()))
                    .map(attributeInstance -> Pair.of(
                            attributeMap.get(attributeInstance.getAttribute().getId()),
                            attributeInstance))
                    .toList();

            // In kết quả
            matchedPairs.forEach(pair -> {
                Attr_of_GetOrderResponse attrResponse = Attr_of_GetOrderResponse.builder()
                        .name(pair.getLeft().getName())
                        .value(pair.getRight().getValue())
                        .build();
                attrOfGetOrderResponseList.add(attrResponse);
//                System.out.println("Attribute: " + pair.getLeft().getName());
//                System.out.println("AttributeInstance Value: " + pair.getRight().getValue());
            });

//          ------------------------------------------------------------------
            product.setProductName(productName);
            product.setListAtt(attrOfGetOrderResponseList);
            product_of_getOrderResponseList.add(product);
        }
        
        for(int i = 0; i < quantityOfProduct.size(); i++){
            product_of_getOrderResponseList.get(i).setQuantity(quantityOfProduct.get(i));
        }
        Double shipping_fee = order.getDelieryFee();
        result.setPrice(String.valueOf(totalPrice+ shipping_fee));
        result.setShipping_fee(shipping_fee);
        result.setListProduct(product_of_getOrderResponseList);
        result.setDeliveryDate(order.getDeliveryDate());
        result.setExpectedDeliveryDate(order.getExpectedDeliveryDate());
        result.setMethod(method);
        result.setIsCOD(isCOD);
        return result;
    }
    public Page<GetOrderResponse> getOrderForBuyer(String username, Pageable pageable){
        List<GetOrderResponse> responses = new ArrayList<>();
        Buyer buyer = buyerRepository.findById(username)
                .orElseThrow(()-> new WebServerException(ErrorCode.USER_NOT_FOUND));

        Page<Order> orderPage = orderRepository.findOrdersByPaymentOrderDeliveryInforBuyer(buyer, pageable);
        if(orderPage.isEmpty()){
            return new PageImpl<>(responses);
        }
        for(Order o: orderPage.getContent()){
            List<Order_ProductInstance> order_productInstanceList = o.getOrderProductInstances();
            List<ProductInstance> productInstances = new ArrayList<>();
            for(Order_ProductInstance opI: order_productInstanceList){
                ProductInstance productInstance = opI.getProductInstance();
                productInstances.add(productInstance);
            }
            responses.add(this.OrderResponseHandler(o, productInstances));
        }


        return new PageImpl<>(
                responses,
                pageable,
                orderPage.getTotalElements()
        );
    }

    public Page<GetOrderResponse> getApprovedOrder(String username, Pageable pageable){
        List<GetOrderResponse> responses = new ArrayList<>();
        Seller seller = sellerRepository.findById(username)
                .orElseThrow(()-> new WebServerException(ErrorCode.USER_NOT_FOUND));
        Page<Order> orderPage = orderRepository.findApprovedOrderBySeller(seller, pageable);
        if(orderPage.isEmpty()){
            return new PageImpl<>(responses);
        }
        for(Order o: orderPage.getContent()){
            List<Order_ProductInstance> order_productInstanceList = o.getOrderProductInstances();
            List<ProductInstance> productInstances = new ArrayList<>();
            for(Order_ProductInstance opI: order_productInstanceList){
                ProductInstance productInstance = opI.getProductInstance();
                productInstances.add(productInstance);
            }
            responses.add(this.OrderResponseHandler(o, productInstances));
        }

        return new PageImpl<>(
                responses,
                pageable,
                orderPage.getTotalElements()
        );
    }

    public Page<GetOrderResponse> getWaitingOrder(String username, Pageable pageable){
        List<GetOrderResponse> responses = new ArrayList<>();
        Seller seller = sellerRepository.findById(username)
                .orElseThrow(()-> new WebServerException(ErrorCode.USER_NOT_FOUND));
        Page<Order> orderPage = orderRepository.findWaitingOrderBySeller(seller, pageable);
        if(orderPage.isEmpty()){
            return new PageImpl<>(responses);
        }
        for(Order o: orderPage.getContent()){
            List<Order_ProductInstance> order_productInstanceList = o.getOrderProductInstances();
            List<ProductInstance> productInstances = new ArrayList<>();
            for(Order_ProductInstance opI: order_productInstanceList){
                ProductInstance productInstance = opI.getProductInstance();
                productInstances.add(productInstance);
            }
            responses.add(this.OrderResponseHandler(o, productInstances));
        }

        return new PageImpl<>(
                responses,
                pageable,
                orderPage.getTotalElements()
        );
    }

    public Page<GetOrderResponse> getCancelledOrder(String username, Pageable pageable){
        List<GetOrderResponse> responses = new ArrayList<>();
        Seller seller = sellerRepository.findById(username)
                .orElseThrow(()-> new WebServerException(ErrorCode.USER_NOT_FOUND));
        Page<Order> orderPage = orderRepository.findCancelOrderBySeller(seller, pageable);
        if(orderPage.isEmpty()){
            return new PageImpl<>(responses);
        }
        for(Order o: orderPage.getContent()){
            List<Order_ProductInstance> order_productInstanceList = o.getOrderProductInstances();
            List<ProductInstance> productInstances = new ArrayList<>();
            for(Order_ProductInstance opI: order_productInstanceList){
                ProductInstance productInstance = opI.getProductInstance();
                productInstances.add(productInstance);
            }
            responses.add(this.OrderResponseHandler(o, productInstances));
        }

        return new PageImpl<>(
                responses,
                pageable,
                orderPage.getTotalElements()
        );
    }

    public Page<GetOrderResponse> getShippingOrder(String username, Pageable pageable){
        List<GetOrderResponse> responses = new ArrayList<>();
        Seller seller = sellerRepository.findById(username)
                .orElseThrow(()-> new WebServerException(ErrorCode.USER_NOT_FOUND));
        Page<Order> orderPage = orderRepository.findShippingOrderBySeller(seller, pageable);
        if(orderPage.isEmpty()){
            return new PageImpl<>(responses);
        }
        for(Order o: orderPage.getContent()){
            List<Order_ProductInstance> order_productInstanceList = o.getOrderProductInstances();
            List<ProductInstance> productInstances = new ArrayList<>();
            for(Order_ProductInstance opI: order_productInstanceList){
                ProductInstance productInstance = opI.getProductInstance();
                productInstances.add(productInstance);
            }
            responses.add(this.OrderResponseHandler(o, productInstances));
        }

        return new PageImpl<>(
                responses,
                pageable,
                orderPage.getTotalElements()
        );
    }

    public Page<GetOrderResponse> getCompletedOrder(String username, Pageable pageable){
        List<GetOrderResponse> responses = new ArrayList<>();
        Seller seller = sellerRepository.findById(username)
                .orElseThrow(()-> new WebServerException(ErrorCode.USER_NOT_FOUND));
        Page<Order> orderPage = orderRepository.findCompletedOrderBySeller(seller, pageable);
        if(orderPage.isEmpty()){
            return new PageImpl<>(responses);
        }
        for(Order o: orderPage.getContent()){
            List<Order_ProductInstance> order_productInstanceList = o.getOrderProductInstances();
            List<ProductInstance> productInstances = new ArrayList<>();
            for(Order_ProductInstance opI: order_productInstanceList){
                ProductInstance productInstance = opI.getProductInstance();
                productInstances.add(productInstance);
            }
            responses.add(this.OrderResponseHandler(o, productInstances));
        }

        return new PageImpl<>(
                responses,
                pageable,
                orderPage.getTotalElements()
        );
    }



    public CreateOrderResponse findById(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new WebServerException(ErrorCode.ORDER_NOT_FOUND));
        CreateOrderResponse response = null;
        return response;
    }

    @Transactional
    public CancelOrderResponse cancelOrder(CancelOrderRequest cancelOrderRequest){
        Order order = orderRepository.findByOrderId(cancelOrderRequest.getOrderId())
                .orElseThrow(()->new WebServerException(ErrorCode.ORDER_NOT_FOUND));
        CancelOrderResponse response = CancelOrderResponse.builder().build();
        if(!order.getStatus().equals("WAITING")){
            response.setMsg("Can not cancel this order because it is " + order.getStatus().toLowerCase());
            return response;
        }

        List<Order_ProductInstance> order_productInstances = order.getOrderProductInstances();
        for(Order_ProductInstance orderProductInstance: order_productInstances){
            ProductInstance productInstance = orderProductInstance.getProductInstance();
            long quantityInStock = productInstance.getQuantityInStock();
            long quanntityInOrder = orderProductInstance.getQuantity();
            productInstance.setQuantityInStock(quantityInStock + quanntityInOrder);
            try{
                productInstanceRepository.save(productInstance);
            }
            catch (WebServerException e){
                response.setMsg("Can not cancel this order");
                return response;
//                throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
            }
        }

        order.setStatus("CANCELLED");
        try {
            orderRepository.save(order);
        }
        catch (WebServerException e){
            response.setMsg("Can not cancel this order");
            return response;
        }
        response.setMsg("Cancel order successfully");
        return response;
    }

    @Transactional
    public ApproveOrderResponse approveOrder(ApproveOrderRequest approveOrderRequest){
        Order order = orderRepository.findByOrderId(approveOrderRequest.getOrderId())
                .orElseThrow(()->new WebServerException(ErrorCode.ORDER_NOT_FOUND));
        ApproveOrderResponse response = ApproveOrderResponse.builder().build();
        order.setStatus("APPROVED");
        try {
            orderRepository.save(order);
        }
        catch (WebServerException e){
            response.setMsg("Can not approve this order");
            return response;
        }

        response.setMsg("Approved order");
        return response;
    }

    @Transactional
    public CreateOrderResponse updateQuantityOfProductFromOrder(String orderId, UpdateQuantityOfProductRequest request) {
        // Tìm đơn hàng dựa vào orderId
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new WebServerException(ErrorCode.ORDER_NOT_FOUND));

        // Kiểm tra trạng thái đơn hàng, nếu không phải "WAITING" thì ném lỗi
        if (!order.getStatus().equals("WAITING")) {
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }

        // Duyệt qua các sản phẩm trong request và cập nhật số lượng
        for (int i = 0; i < request.getProducts().size(); i++) {
            String productId = request.getProducts().get(i);
            Long quantity = request.getQuantity().get(i);

            // Tìm product instance để cập nhật sản phẩm trong kho
            ProductInstance productInstance = productInstanceRepository.findById(productId)
                    .orElseThrow(() -> new WebServerException(ErrorCode.PRODUCT_NOT_FOUND));

            // Kiểm tra sản phẩm có trong đơn hàng không
            Optional<Order_ProductInstance> existingProduct = order.getOrderProductInstances().stream()
                    .filter(op -> op.getProductInstance().getId().equals(productId))
                    .findFirst();

            if (existingProduct.isPresent()) {
                // Nếu số lượng là 0, xóa sản phẩm khỏi đơn hàng
                if (quantity == 0) {
                    orderProductInstanceRepository.delete(existingProduct.get());
                } else {
                    // Cập nhật số lượng sản phẩm
                    existingProduct.get().setQuantity(quantity);
                }
            } else {
                // Nếu sản phẩm không tồn tại trong đơn hàng, tiếp tục vòng lặp
                continue;
            }
        }

        // Tính lại tổng giá tiền của đơn hàng
        Double newTotalPrice = 0.0;
        for (Order_ProductInstance orderProduct : order.getOrderProductInstances()) {
            newTotalPrice += orderProduct.getProductInstance().getPrice() * orderProduct.getQuantity();
        }

        // Cập nhật lại tổng giá cho đơn hàng
        order.setTotalPrice(newTotalPrice);

        // Lưu đơn hàng đã cập nhật
        orderRepository.save(order);

        // Trả về thông tin đơn hàng đã cập nhật
        return findById(orderId);
    }

    @Transactional
    public CreateOrderResponse updateOrderState(String order_id, String newState) {
        Order order = orderRepository.findById(order_id)
                .orElseThrow( ()-> new WebServerException(ErrorCode.UNKNOWN_ERROR));
        order.setStatus(newState);
        try{
            orderRepository.save(order);
            return this.findById(order_id);
        }
        catch (WebServerException e){
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }
    }


}
