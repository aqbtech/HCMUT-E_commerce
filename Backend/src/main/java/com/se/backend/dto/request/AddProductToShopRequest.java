package com.se.backend.dto.request;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
@Builder
public class AddProductToShopRequest {
    private String username;
    private String name;
    private String description;
    private String category;
    private List<AttributeRequest> attributes;
    private List<ProductInstanceRequest> productInstances;
    @Getter
    @AllArgsConstructor
    public static class AttributeRequest {
        private String name;
        private List<String> values;
    }

    @Getter
    @AllArgsConstructor
    public static class ProductInstanceRequest {
        private List<String> attributeValues;
        private Double price;
        private Long quantityInStock;
    }
}
