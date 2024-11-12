package com.se.backend.dto.response;

import lombok.Data;

import java.util.Map;

@Data
public class Instant {
	private String instantId;
	private Map<String, String> attributes;
	private Double price;
	private Long quantityInStock;
//	private String image;
}
