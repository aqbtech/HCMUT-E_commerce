package com.se.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SellerforAdminResponse {
    private String sellerName;
    private String shopName;
    private Boolean status;
}
