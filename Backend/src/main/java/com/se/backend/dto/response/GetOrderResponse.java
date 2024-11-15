package com.se.backend.dto.response;

import lombok.Builder;
import lombok.Data;

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
        private String method;
}