package com.se.backend.dto.request;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class DeliveryAddress_of_CreateOrderRequest {
    private String id;
    private String name;
    private String phone;
    private String province;
    private String district;
    private String ward;
    private String Detail;
}
