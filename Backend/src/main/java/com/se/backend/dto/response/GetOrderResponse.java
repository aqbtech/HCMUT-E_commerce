package com.se.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class GetOrderResponse {
        private String orderId;
        private String deliveryState;
        private String sellerName;
        private String price;
        private List<Product_of_GetOrderResponse> listProduct;
        private DeliveryAddress_of_GetOrderResponse deliveryAddress;
        private String seller;
        private String method;
        private Double shipping_fee;
        private LocalDate deliveryDate;
        private LocalDate expectedDeliveryDate;
}
