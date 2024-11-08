package com.se.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserDeliveryInfo {
	@JsonProperty("id")
	private String deliveryId;
	@JsonProperty("hoVaTen")
	private String receiverName;
	@JsonProperty("phone")
	private String receiverPhone;
	@JsonProperty("DetailAddress")
	private String address;
	@JsonProperty("city")
	private String city;
	@JsonProperty("huyen")
	private String district;
	@JsonProperty("xa")
	private String ward;
}
