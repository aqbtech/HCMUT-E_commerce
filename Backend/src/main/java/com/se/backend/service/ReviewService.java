package com.se.backend.service;

import com.se.backend.dto.request.ReviewRequest;
import com.se.backend.dto.response.ReviewDetail;
import com.se.backend.dto.response.ReviewProductInstanceResponse;
import com.se.backend.dto.response.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
	Double ratingCalculator(String productId);
	Page<ReviewDetail> getReviews(String productId, Pageable pageable);
	// Page<ReviewSummary> getReviewSummary(String productId, Pageable pageable);
	ReviewResponse reviewProduct(String username, ReviewRequest reviewRequest);
	ReviewProductInstanceResponse getAllProductInstanceToReview(String username);
}
