package com.se.backend.service;

import com.se.backend.dto.response.ReviewDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
	Double ratingCalculator(String productId);
	Page<ReviewDetail> getReviews(String productId, Pageable pageable);
	// Page<ReviewSummary> getReviewSummary(String productId, Pageable pageable);
}
