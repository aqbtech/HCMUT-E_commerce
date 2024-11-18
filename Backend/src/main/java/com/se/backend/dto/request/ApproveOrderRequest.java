package com.se.backend.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
public class ApproveOrderRequest {
    private String orderId;
}
