package com.se.backend.dto.request;

import lombok.Data;

@Data

public class UpdateShopAddressInformationRequest {
    private String province;
    private String district;
    private String commune;
    private String specific_address;
}
