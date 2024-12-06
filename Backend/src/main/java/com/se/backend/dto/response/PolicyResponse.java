package com.se.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class PolicyResponse {
//    private List<ShopPolicyResponse> shopPolicyResponse;
//    private List<CategoryPolicyResponse> categoryPolicyResponse;
//    @Data
//    @Builder
//    public static class ShopPolicyResponse{
        private LocalDate apply_date;
        private String policy_description;
        private String policy_name;
        private LocalDate release_date;
        private Double sale;
        private Long count;
//    }
//    @Data
//    @Builder
//    public static class CategoryPolicyResponse{
//
//    }
}
