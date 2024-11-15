package com.se.backend.dto.response;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class Instant {
	private String instantId;
	private Map<String, String> attributes;
	private Double price;
	private Long quantityInStock;
//	private String image;
	public void addAttribute(Map<String, String> attribute) {
		Map<String, String> old = this.attributes;
		if(old == null) {
			old = new HashMap<>();
		}
		old.put(attribute.keySet().iterator().next(), attribute.values().iterator().next());
		this.attributes = old;
	}
}
