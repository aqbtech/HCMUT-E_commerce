package com.se.backend.dto.request;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CreateOrderRequest {
    private String username;
    private List<Product_of_OrderRequest> ListProduct;
    private DeliveryAddress_of_CreateOrderRequest deliveryAddress;
    private String method;
}
