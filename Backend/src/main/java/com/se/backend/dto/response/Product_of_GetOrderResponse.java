package com.se.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class Product_of_GetOrderResponse {
    private String productId;
    private String productName;
    private List<Attr_of_GetOrderResponse> listAtt;
    private String IMG;
    private long price;
    private long quantity;
}
