package com.se.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShopAddressResponse {
    private String province;
    private String district;
    private String commune;
    private String specific_address;
}
