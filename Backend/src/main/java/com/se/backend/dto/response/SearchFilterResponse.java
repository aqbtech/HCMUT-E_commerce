package com.se.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

@Data
@Builder
public class SearchFilterResponse {
    private Page<ProductSummary> productSummaryPage;
    private FilterValueResponse filter;
    private FilterResponse available;
}
