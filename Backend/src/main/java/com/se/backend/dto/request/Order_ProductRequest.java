package com.se.backend.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Order_ProductRequest {
    private String productId;
    private String orderId;
    private Long quantity;
}
