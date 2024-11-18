package com.se.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CartProduct {
	private String productId;
	private String productInstanceId;
	private String productName;
	private Long quantity;
	private Double price;
	@JsonProperty("IMG")
	private String imageUrl;
	private List<String> listName;
	private List<String> listValue;
	private CartProduct() {
	}
}
