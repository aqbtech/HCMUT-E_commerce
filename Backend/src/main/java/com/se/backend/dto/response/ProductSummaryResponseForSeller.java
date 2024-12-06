package com.se.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ProductSummaryResponseForSeller {
    private String productId;
    private String name;
    private Double rating;
    private String shopName;
    private Double minPrice;
    @JsonProperty("img")
    private String firstImage;
    private String status;
}
