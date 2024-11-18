package com.se.backend.service;

import com.se.backend.dto.response.UserDeliveryInfo;

import java.util.List;

public interface AddressService {
	List<UserDeliveryInfo> getUserDeliveryInfo(String username);
}
