package com.se.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class PolicyResponse {
//    private List<ShopPolicyResponse> shopPolicyResponse;
//    private List<CategoryPolicyResponse> categoryPolicyResponse;
//    @Data
//    @Builder
//    public static class ShopPolicyResponse{
        private Long policyId;
        private String type;
        private LocalDate apply_date;
        private String policy_description;
        private String policy_name;
        private LocalDate release_date;
        private Double sale;
        private Long count;
        private List<String> target;
//    }
//    @Data
//    @Builder
//    public static class CategoryPolicyResponse{
//
//    }
}
