package com.se.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class Product_of_GetOrderResponse {
    private String productId;
    private String productName;
    private Double sale;
    private List<Attr_of_GetOrderResponse> listAtt;
    @JsonProperty("img")
    private String firstImage;
    private String id;
    private long price;
    private long quantity;
}
