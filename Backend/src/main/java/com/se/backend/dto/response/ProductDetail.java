package com.se.backend.dto.response;

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
	private double rating;
	private String description;
	private int quantityInStock;
	private List<Attribute> attributes;
	private List<String> images;
	private Seller seller;
	private List<Review> reviews;

	// Getters and Setters
	@Getter
	@Setter
	@AllArgsConstructor
	public static class Attribute {
		private String name;
		private List<String> values;
	}
	@Getter
	@Setter
	@AllArgsConstructor
	public static class Seller {
		private String sellerId;
		private String shopName;
		private String location;
	}
	@Getter
	@Setter
	@AllArgsConstructor
	public static class Review {
		private String reviewId;
		private String reviewerName;
		private String reviewContent;
		private int rating;
	}
}

