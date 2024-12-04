package com.se.backend.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReviewRequest {
    private String orderId;
    private String productInstanceId;
    private double rating;
    private String comment;
}
