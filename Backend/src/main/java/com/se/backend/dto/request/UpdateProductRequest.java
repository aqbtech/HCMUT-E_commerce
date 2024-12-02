package com.se.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.util.List;
@Data
@Builder
public class UpdateProductRequest {
    private String username;
    private String productId;
    private String name;
    private String description;
    private String category;
    private List<AttributeReq> attributes;
    private List<ProductInstanceReq> productInstances;
    @Getter
    @AllArgsConstructor
    public static class AttributeReq {
        private String name;
        private List<String> values;
    }
    @Getter
    @AllArgsConstructor
    public static class ProductInstanceReq {
        private List<String> attributeValues;
        private Double price;
        private Long quantityInStock;
    }
}
