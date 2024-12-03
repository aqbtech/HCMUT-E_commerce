package com.se.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class FakeAPIDeliveryResponse {
    private String deliveryName;
    private String deliveryCode;
    private LocalDate expectedDeliveryDate;
    private LocalDate deliveryDate;
    private LocalDate deliveryJoinDate;
    private String deliveryStatus;
    private int fee;
}
