package com.se.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Attr_of_GetOrderResponse {
    private String name;
    private String value;
}
