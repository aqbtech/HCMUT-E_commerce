package com.se.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShopInformationResponse {
    private String shopName;
    private Double rating;
    private Integer numberOfProduct;
    private Integer follower;
    private ShopAddressResponse address;
}
