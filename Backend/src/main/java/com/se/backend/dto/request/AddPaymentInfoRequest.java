package com.se.backend.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddPaymentInfoRequest {
    private String STK;
    private String bankName;
    private String ownerName;
}
