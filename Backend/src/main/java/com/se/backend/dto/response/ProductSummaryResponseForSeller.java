package com.se.backend.dto.response;

import lombok.Data;

@Data
public class ProductSummaryResponseForSeller {
    private String productId;
    private String name;
    private Double rating;
    private Double minPrice;
    private String img;
    private String status;
}
