package com.se.backend.dto.request;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Builder
@Data
public class FakeOrderInforRequest {
    private String orderId;
    private LocalDate deliveryDate;
    private LocalDate expectedDeliveryDate;
    private String status;
}
