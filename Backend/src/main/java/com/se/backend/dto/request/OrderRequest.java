package com.se.backend.dto.request;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class OrderRequest {
    private String buyerId;
    private String id;
    private String state;
    private List<String> products;
    private List<Long> quantity;
}
