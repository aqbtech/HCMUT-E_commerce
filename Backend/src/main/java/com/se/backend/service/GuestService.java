package com.se.backend.service;

import com.se.backend.dto.response.ProductDetail;

public interface GuestService {
	ProductDetail getProductDetail(String productId);
}
