package com.se.backend.service;

import com.se.backend.dto.response.ProductDetail;
import com.se.backend.dto.response.UserDeliveryInfo;

public interface GuestService {
	ProductDetail getProductDetail(String productId);
	UserDeliveryInfo getUserDeliveryInfo(String username);
}
