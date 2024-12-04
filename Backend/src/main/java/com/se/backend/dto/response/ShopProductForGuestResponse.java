package com.se.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@Builder
public class ShopProductForGuestResponse {
    private Page<ProductSummary> productSummaryPage;
    private List<String> categories;
    private String categoryValue;
}
