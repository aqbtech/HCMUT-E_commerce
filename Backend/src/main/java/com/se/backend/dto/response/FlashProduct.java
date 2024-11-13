package com.se.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class FlashProduct {
	private String productId;
	private String productName;
	private int quantity;
	private double price;
	@JsonProperty("IMG")
	private String imageUrl;
	private List<String> listName;
	private List<String> listValue;
}
