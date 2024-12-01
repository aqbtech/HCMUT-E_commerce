package com.se.backend.service;

import com.se.backend.dto.request.UserRegister;
import com.se.backend.dto.response.MinimalUserProfile;
import com.se.backend.dto.response.ProductDetail;
import com.se.backend.dto.response.ProductSummary;
import com.se.backend.dto.response.ReviewDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GuestService {
	ProductDetail getProductDetail(String productId);

	Page<ReviewDetail> getReviews(String productId, Pageable pageable);
	Page<ProductSummary> getHomePage(int page);
	MinimalUserProfile register(UserRegister userRegister);
}
