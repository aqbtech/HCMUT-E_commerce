package com.se.backend.service.business;


import com.se.backend.dto.request.CreateOrderRequest;
import com.se.backend.dto.request.AddProductRequest;
import com.se.backend.dto.request.UpdateQuantityOfProductRequest;
import com.se.backend.dto.response.CreateOrderResponse;
import com.se.backend.entity.*;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.mapper.OrderMapper;
import com.se.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService  {
    @Autowired
    private final OrderRepository orderRepository;
    @Autowired
    private final OrderMapper orderMapper;
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
    @Transactional
    public CreateOrderResponse create(CreateOrderRequest createOrderRequest){
        long addressId;
        try{
            addressId = Long.parseLong(createOrderRequest.getDeliveryAddressOfCreateOrderRequest().getId());
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
        PaymentOrder paymentOrder = new PaymentOrder();
        Buyer buyer = buyerRepository.findByUsername(username)
                .orElseThrow(() -> new WebServerException(ErrorCode.USER_NOT_FOUND));
        paymentOrder.setDeliveryInfor(deliveryInfor);
        paymentOrder.setOrder(new ArrayList<>());
        paymentOrder.setReview(new ArrayList<>());
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
                throw new WebServerException(ErrorCode.INSUFFICIENT_STOCK);
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

            long totalPrice = 0L;
            List<Order_ProductInstance> orderProducts = new ArrayList<>();

            for (int i = 0;  i < entry.getValue().size(); i++) {
                Order_ProductInstance orderProductInstance = entry.getValue().get(i);
                orderProductInstance.getOrder_productInstanceId().setOrderId(order.getOrderId());
                orderProductInstance.setOrder(order);
                Long quantity = entry.getValue().get(i).getQuantity();
                ProductInstance productInstance = orderProductInstance.getProductInstance();

                orderProducts.add(orderProductInstance);
                totalPrice += productInstance.getPrice() * quantity;

            }
            order.setTotalPrice(totalPrice);
            order.setOrderProductInstances(orderProducts);
//            order.setDelivery(deliveryInfor);
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
        }
        paymentOrderRepository.save(paymentOrder);
        CreateOrderResponse response = CreateOrderResponse.builder().msg("successful").build();
        // Tạo phản hồi OrderResponse
        return response;
    }
    @Transactional
    public String addProductToOrder(String orderId, AddProductRequest addProductRequest) {

            //Find Order//HERE
        Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new WebServerException(ErrorCode.UNKNOWN_ERROR));
        long newPrice = 0L;
        // if state of order is not "WAITING" then throw "State of order does not allow to add product"
        if(!order.getStatus().equals("WAITING")){
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }
            //Find Product//HERE
        ProductInstance productInstance =productInstanceRepository.findById(addProductRequest.getProductId())
                    .orElseThrow(() -> new WebServerException(ErrorCode.UNKNOWN_ERROR));
        if(productInstance.getBuildProduct().getProduct().getSeller() != order.getSeller()){
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

//    public List<CreateOrderResponse> getAll(String buyerId){
//        List<CreateOrderResponse> responses = new ArrayList<>();
//        Buyer buyer = buyerRepository.findById(buyerId)
//                .orElseThrow(()-> new WebServerException(ErrorCode.USER_NOT_FOUND));
//        for(PaymentOrder paymentOrder : buyer.getPaymentOrder()){
//            for(Order order : paymentOrder.getOrder()){
//                responses.add(orderMapper.toOrderResponse(order));
//            }
//        }
//        return responses;
//    }

    public CreateOrderResponse findById(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new WebServerException(ErrorCode.ORDER_NOT_FOUND));
        CreateOrderResponse response = null;
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
        long newTotalPrice = 0L;
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
//
//    @Transactional
//    public String deleteOrder(String id) {
//        // Tìm đơn hàng
//        Optional<Order> orderOpt = orderRepository.findById(id);
//
//        if (orderOpt.isEmpty()) {
//            return "Order not found" + "Processing"; // Thêm trạng thái hiện tại của đơn hàng nếu có
//        }
//
//        Order order = orderOpt.get();
//
//        // Giả sử bạn không thể xóa đơn hàng nếu nó đã được hoàn thành
//        if ("Completed".equals(order.getState().toString())) {
//            return "Cannot delete completed order!";
//        }
//
//        // Xóa đơn hàng
//        orderRepository.delete(order);
//
//        return "Order deleted successfully!";  // Trả về trạng thái đơn hàng sau khi xóa
//    }
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
