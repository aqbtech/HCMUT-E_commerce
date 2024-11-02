package com.se.backend.service;

import com.se.backend.dto.response.ProductDetail;
import com.se.backend.repository.ProductInstanceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class GuestServiceImpl implements GuestService {
	private final ProductInstanceRepository productInstanceRepository;

	@Override
	public ProductDetail getProductDetail(String productId) {
		// get product detail from database use productInstanceRepository
		var productDetail = productInstanceRepository.findProductDetailProjectionById(productId);
		// mapping data from entity to dto
		log.info("Product ID: {}", productId);
		return ProductDetail.builder().build();
	}
}
