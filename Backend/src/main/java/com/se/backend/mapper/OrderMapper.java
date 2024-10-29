package com.se.backend.mapper;

import com.se.backend.dto.response.OrderResponse;
import com.se.backend.dto.response.ProductResponse;
import com.se.backend.entity.Order;
import com.se.backend.entity.Order_ProductInstance;
import org.mapstruct.Mapper;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    default OrderResponse toOrderResponse(Order order){
        if (order == null) {
            return null;
        }
        List<Long> quantity = new ArrayList<>();
        List<ProductResponse> productResponses = new ArrayList<>();
        OrderResponse.OrderResponseBuilder orderResponse = OrderResponse.builder();
        orderResponse.orderId(order.getOrderId());
        orderResponse.status(order.getStatus());
        orderResponse.totalPrice(order.getTotalPrice());
        orderResponse.delivery(order.getDelivery());
        orderResponse.deliveryCode(order.getDeliveryCode());
        orderResponse.expectedDeliveryDate(order.getExpectedDeliveryDate());
        orderResponse.deliveryDate(order.getDeliveryDate());
        orderResponse.deliveryJoinDate(order.getDeliveryJoinDate());
        orderResponse.deliveryStatus(order.getDeliveryStatus());
        List<Order_ProductInstance> order_productInstances = order.getOrderProductInstances();
        for (Order_ProductInstance product : order_productInstances) {
            String name = product.getProductInstance().getBuildProduct().getProduct().getName();
            long price = product.getProductInstance().getPrice();
            String id = product.getProductInstance().getId();
            ProductResponse prd = ProductResponse.builder()
                    .name(name)
                    .id(id)
                    .build();
            quantity.add(product.getQuantity());
            productResponses.add(prd);
        }
        orderResponse.quantity(quantity);
        orderResponse.products(productResponses);
        return orderResponse.build();
    }
//    default ProductResponse order_ProductToProductResponse(Order_ProductInstance order_Product) {
//        if ( order_Product == null ) {
//            return null;
//        }
//
//        ProductResponse.ProductResponseBuilder productResponse = ProductResponse.builder();
//
//        if ( order_Product.getOrder_productInstanceId() != null ) {
//            productResponse.id(order_Product.getProductInstance().getBuildProduct().getProduct().getId());
//            productResponse.price(order_Product.getProductInstance().getPrice());
//            productResponse.name(order_Product.getProductInstance().getBuildProduct().getProduct().getName());
//        }
//
//        return productResponse.build();
//    }

}
