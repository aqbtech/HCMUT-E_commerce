package com.se.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddProductToShopResponse {
    private String msg;
    private String productId;
}
