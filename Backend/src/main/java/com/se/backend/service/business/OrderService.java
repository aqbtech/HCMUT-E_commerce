package com.se.backend.service.business;


import com.se.backend.dto.request.CreateOrderRequest;
import com.se.backend.dto.request.AddProductRequest;
import com.se.backend.dto.request.UpdateQuantityOfProductRequest;
import com.se.backend.dto.response.OrderResponse;
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
    private final PaymentOrderRepository paymentOrderRepository;
    @Autowired
    private final Order_ProductInstanceRepository orderProductInstanceRepository;
    @Transactional
    public List<OrderResponse> create(CreateOrderRequest createOrderRequest){

        PaymentOrder paymentOrder = new PaymentOrder();
        Buyer buyer = buyerRepository.findById(createOrderRequest.getBuyerId())
                .orElseThrow(() -> new WebServerException(ErrorCode.USER_NOT_FOUND));
        paymentOrder.setBuyer(buyer);
        paymentOrder.setOrder(new ArrayList<>());
        paymentOrder.setReview(new ArrayList<>());
        paymentOrderRepository.save(paymentOrder);
        Map<String, List<Order_ProductInstance>> sellerOrderMap = new HashMap<>();
        for (int i = 0; i < createOrderRequest.getProducts().size(); i++) {
            String productId = String.valueOf(createOrderRequest.getProducts().get(i));
            Long quantity = createOrderRequest.getQuantity().get(i);

            // Tìm sản phẩm
            ProductInstance productInstance = productInstanceRepository.findById(productId)
                    .orElseThrow(() -> new WebServerException(ErrorCode.PRODUCT_NOT_FOUND));

            // Kiểm tra số lượng trong kho
            if (productInstance.getQuantityInStock() < quantity) {
                throw new WebServerException(ErrorCode.INSUFFICIENT_STOCK);
            }

            // Lấy seller của sản phẩm
            String sellerId = productInstance.getBuildProduct().getProduct().getSeller().getUsername();

            // Tạo đối tượng Order_ProductInstance
            Order_ProductInstanceId orderProductInstanceId = new Order_ProductInstanceId();
            orderProductInstanceId.setProductInstanceId(productInstance.getId()); // Đặt productInstanceId

            Order_ProductInstance orderProductInstance = Order_ProductInstance.builder()
                    .order_productInstanceId(orderProductInstanceId)
                    .quantity(quantity)
                    .productInstance(productInstance)
                    .build();

            // Thêm sản phẩm vào danh sách tương ứng với seller
            sellerOrderMap.computeIfAbsent(sellerId, k -> new ArrayList<>()).add(orderProductInstance);
        }

//        List<Order> orders = new ArrayList<>();

        List<OrderResponse> responses = new ArrayList<>();
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
//            List<ProductResponse> productResponses = new ArrayList<>();

            for (int i = 0;  i < entry.getValue().size(); i++) {
                Order_ProductInstance orderProductInstance = entry.getValue().get(i);
                orderProductInstance.setOrder(order);
                Long quantity = entry.getValue().get(i).getQuantity();
                ProductInstance productInstance = orderProductInstance.getProductInstance();

                orderProducts.add(orderProductInstance);
                totalPrice += productInstance.getPrice() * quantity;
//                ProductResponse productResponse = ProductResponse.builder()
//                        .price(productInstance.getPrice())
//                        .name(productInstance.getBuildProduct().getProduct().getName())
//                        .id(productInstance.getId())
//                        .build();
//                productResponses.add(productResponse);
            }
            order.setTotalPrice(totalPrice);
            order.setOrderProductInstances(orderProducts);
            paymentOrder.getOrder().add(order);
            try {
                orderRepository.save(order);

            }catch (WebServerException e){
                throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
            }
        }
        paymentOrderRepository.save(paymentOrder);
        for (Order order : paymentOrder.getOrder()) {

            responses.add(findById(order.getOrderId()));
        }
        // Tạo phản hồi OrderResponse
        return responses;
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

    public List<OrderResponse> getAll(String buyerId){
        List<OrderResponse> responses = new ArrayList<>();
        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(()-> new WebServerException(ErrorCode.USER_NOT_FOUND));
        for(PaymentOrder paymentOrder : buyer.getPaymentOrder()){
            for(Order order : paymentOrder.getOrder()){
                responses.add(orderMapper.toOrderResponse(order));
            }
        }
        return responses;
    }

    public OrderResponse findById(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new WebServerException(ErrorCode.ORDER_NOT_FOUND));
        OrderResponse response = orderMapper.toOrderResponse(order);
        response.setQuantity(new ArrayList<Long>());
        for(Order_ProductInstance product:order.getOrderProductInstances()){
            response.getQuantity().add(product.getQuantity());
        }
        return response;
    }
    @Transactional
    public OrderResponse updateQuantityOfProductFromOrder(String orderId, UpdateQuantityOfProductRequest request) {
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
    public OrderResponse updateOrderState(String order_id, String newState) {
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
