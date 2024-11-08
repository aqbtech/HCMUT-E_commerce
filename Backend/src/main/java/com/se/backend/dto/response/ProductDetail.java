package com.se.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class ProductDetail {
	private String productId;
	@JsonProperty("product_name")
	private String name;
//	private Double rating;
	private String description;
	private Long quantityInStock;
	private List<AttributeDetail> attributes;
//	private List<String> images;
	private Seller seller;
	// add some variant of product, with variant = product + attribute{+ attributeInstance} => productInstance
	// add minPrice, maxPrice, price, discount, discountPercent, discountPrice
	@Getter
	@Setter
	@AllArgsConstructor
	public static class Seller {
		private String sellerId;
		private String shopName;
		private String location;
	}
}

