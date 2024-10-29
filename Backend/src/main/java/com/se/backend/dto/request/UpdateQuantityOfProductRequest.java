package com.se.backend.dto.request;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UpdateQuantityOfProductRequest {
    List<String> products;
    List<Long> quantity;
}
