package com.se.backend.dto.response;

import lombok.Data;

@Data
public class ProductSummary {
	private String productId;
	private String name;
	private Double rating;
	private Double minPrice;
	private String firstImage;
}
