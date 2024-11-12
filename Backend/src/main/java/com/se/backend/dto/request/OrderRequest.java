package com.se.backend.dto.request;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class OrderRequest {
    private String username;
    private List<Product_of_OrderRequest> ListProduct;
    private DeliveryAddress_of_CreateOrderRequest deliveryAddressOfCreateOrderRequest;
    private String method;
}
