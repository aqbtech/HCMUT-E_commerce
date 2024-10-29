package com.se.backend.dto.response;

import java.time.LocalDate;
import java.util.List;

import com.se.backend.entity.Delivery;
import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class OrderResponse {
    private String orderId;
    private String status;
    private Long totalPrice;
//    private List<Object> products;
    private List<ProductResponse> products;
    private List<Long> quantity;
    private Delivery delivery;
    private String deliveryCode;
    private LocalDate expectedDeliveryDate;
    private LocalDate deliveryDate;
    private LocalDate deliveryJoinDate;
    private String deliveryStatus;
}
