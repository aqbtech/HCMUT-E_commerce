package com.se.backend.dto.response;

import com.se.backend.dto.request.UpdateProductRequest;
import lombok.*;

import java.util.List;

@Data
@Builder
public class GetDetailProductResponse {
    private String productId;
    private String name;
    private String description;
    private List<String> img;
    private String category;
    private List<AttributeRequest> attributes;
    private List<ProductInstanceRequest> productInstances;
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AttributeRequest {
        private String name;
        private List<String> values;
    }
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductInstanceRequest {
        private List<String> attributeValues;
        private Double price;
        private Long quantityInStock;
    }
}
