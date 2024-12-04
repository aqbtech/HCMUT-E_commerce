package com.se.backend.dto.response;

import lombok.*;

import java.util.List;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReviewProductInstanceResponse {
    List<OrderReview> orderReivewList;
    @Data
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderReview {
        private String productName;
        private String orderId;
        private String productInstanceId;
        private double price;
        private List<String> value;
        private boolean isReview;
        private ReviewInfo reviewInfo;
        @AllArgsConstructor
        @NoArgsConstructor
        @Data
        public static class ReviewInfo {
            private double rating;
            private String comment;
        }
    }
}
