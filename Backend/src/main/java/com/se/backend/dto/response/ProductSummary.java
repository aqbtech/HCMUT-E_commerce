package com.se.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ProductSummary {
	private String productId;
	private String name;
	private Double rating;
	private Double minPrice;
	private Double sale;
	@JsonProperty("img")
	private String firstImage;
}
