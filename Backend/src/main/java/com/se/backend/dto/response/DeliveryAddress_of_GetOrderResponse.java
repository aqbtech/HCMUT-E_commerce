package com.se.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DeliveryAddress_of_GetOrderResponse {
    private String name;
    private String phone;
    private String province;
    private String state;
    private String Detail;

}
