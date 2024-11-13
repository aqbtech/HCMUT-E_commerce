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
	@JsonProperty("name")
	private String receiverName;
	@JsonProperty("phone")
	private String receiverPhone;
	@JsonProperty("detailAddress")
	private String address;
	@JsonProperty("province")
	private String city;
	@JsonProperty("district")
	private String district;
	@JsonProperty("ward")
	private String ward;
}
