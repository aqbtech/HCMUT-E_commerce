package com.se.backend.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddAddressRequest {
    private String name;
    private String phone;
    private String province;
    private String district;
    private String ward;
    private String detail;
}
