package com.se.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class ProductDetail {
	private String productId;
	@JsonProperty("product_name")
	private String name;
	private Double rating;
	private Double sale;
	private String description;
	private Double minPrice;
	private Double maxPrice;
	private Long totalQuantityInStock;
	@JsonProperty("listAtt")
	private List<AttributeDetail> attributes;
	//	private List<String> images;
	private Seller seller;
	// add some variant of product, with variant = product + attribute{+ attributeInstance} => productInstance
	@JsonProperty("listInstants")
	private List<Instant> instants;
	// add minPrice, maxPrice, price, discount, discountPercent, discountPrice
	// list img for product
	@JsonProperty("images")
	private List<String> imagesPublicLink;
	@Getter
	@Setter
	@AllArgsConstructor
	public static class Seller {
		private String sellerId;
		private String shopName;
		private String location;
	}
}

