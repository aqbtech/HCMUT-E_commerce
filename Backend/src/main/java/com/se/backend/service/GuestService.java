package com.se.backend.service;


import com.se.backend.dto.response.*;

import com.se.backend.dto.request.FilterProductRequest;
import com.se.backend.dto.request.UserRegister;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface GuestService {
	ProductDetail getProductDetail(String productId);

	Page<ReviewDetail> getReviews(String productId, Pageable pageable);
	Page<ProductSummary> getHomePage(int page);


	List<CategoryResponse> getAllCategory();

	MinimalUserProfile register(UserRegister userRegister);
	SearchFilterResponse searchByKeyword(String keyword, int page, String sort);
	SearchFilterResponse filterProducts(String keyword, int page, String sort, FilterProductRequest request);
}
