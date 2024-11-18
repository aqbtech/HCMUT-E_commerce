package com.se.backend.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
public class CancelOrderRequest {
    private String orderId;
}
