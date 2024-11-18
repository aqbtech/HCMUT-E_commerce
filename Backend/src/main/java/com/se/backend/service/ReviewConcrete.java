package com.se.backend.service;

import com.se.backend.dto.response.ReviewDetail;
import com.se.backend.entity.Product;
import com.se.backend.mapper.ReviewMapper;
import com.se.backend.repository.ProductRepository;
import com.se.backend.repository.ReviewRepository;
import com.se.backend.utils.PaginationUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicReference;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewConcrete implements ReviewService {
	private final ReviewRepository reviewRepository;
	private final ProductRepository productRepository;
	private final ReviewMapper reviewMapper;
	@Override
	public Double ratingCalculator(String productId) {
		var reviews = reviewRepository.findReviewByProductId(productRepository.findProductSummaryById(productId));
		AtomicReference<Double> result = new AtomicReference<>(0.0);
		reviews.stream().mapToDouble(r -> r.getReviewContent().getRating()).average().ifPresent(result::set);
		return result.get();
	}

	@Override
	public Page<ReviewDetail> getReviews(String productId, Pageable pageable) {
		Product p = productRepository.findProductSummaryById(productId);
		var pg = reviewRepository.findReviewByProductId(p);
		var listPg = reviewMapper.toReviewDetail(pg);
		return PaginationUtils.convertListToPage(listPg, pageable);
	}
}
