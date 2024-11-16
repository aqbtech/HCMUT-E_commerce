package com.se.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DeliveryAddress_of_GetOrderResponse {
    private String id;
    private String name;
    private String phone;
    private String province;
    private String district;
    private String ward;
    private String detail;

}
