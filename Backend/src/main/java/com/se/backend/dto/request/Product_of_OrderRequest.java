package com.se.backend.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Product_of_OrderRequest {
    private String productId;
    private String instantId;
    private Long quantity;
}
