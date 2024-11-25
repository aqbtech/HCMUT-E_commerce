package com.se.backend.dto.request;

import lombok.Data;

@Data
public class UpdateShopInformationRequest {
    private String shopName;
    private UpdateShopAddressInformationRequest address;
}
