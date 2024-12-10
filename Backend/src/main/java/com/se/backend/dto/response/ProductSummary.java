package com.se.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummary {
	private String productId;
	private String name;
	private Double rating;
	private Double minPrice;
	private Double sale;
	@JsonProperty("img")
	private String firstImage;
}
