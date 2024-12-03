package com.se.backend.service;

import com.se.backend.dto.request.AddAddressRequest;
import com.se.backend.dto.request.UpdateAddressRequest;
import com.se.backend.dto.response.UserDeliveryInfo;

import java.util.List;

public interface AddressService {
	List<UserDeliveryInfo> getUserDeliveryInfo(String username);
	String addAddress(String username, AddAddressRequest addressRequest);
	String updateAddress(String username, UpdateAddressRequest addressRequest);
	String deleteAddress(String username, Long addressId);
}
