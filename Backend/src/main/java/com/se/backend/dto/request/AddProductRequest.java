package com.se.backend.dto.request;

import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class AddProductRequest {
    private String buyerId;
    private String productId;
    private Long quantity;
}
