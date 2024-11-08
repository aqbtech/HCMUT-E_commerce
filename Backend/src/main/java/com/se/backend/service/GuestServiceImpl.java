package com.se.backend.service;

import com.se.backend.dto.response.AttributeDetail;
import com.se.backend.dto.response.ProductDetail;
import com.se.backend.dto.response.ReviewDetail;
import com.se.backend.dto.response.UserDeliveryInfo;
import com.se.backend.entity.Attribute;
import com.se.backend.entity.AttributeInstance;
import com.se.backend.entity.Review;
import com.se.backend.mapper.AttributeMapper;
import com.se.backend.mapper.DeliveryMapper;
import com.se.backend.mapper.ProductDetailMapper;
import com.se.backend.mapper.ReviewMapper;
import com.se.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class GuestServiceImpl implements GuestService {
	private final ProductRepository productRepository;
	private final AttributeRepository attributeRepository;
	private final ReviewRepository reviewRepository;
	@Autowired
	private ProductDetailMapper productDetailMapper;
	@Autowired
	private AttributeMapper attributeMapper;
	@Autowired
	private ReviewMapper reviewMapper;
	@Override
	public ProductDetail getProductDetail(String productId) {
//		var productDetail = productRepository.findProductDetailById(productId);
		var product = productRepository.findProductById(productId);
		var reviews = reviewRepository.findReviewByProductId(productId);
		List<AttributeDetail> attributes = new ArrayList<>();
		// dummy code for test :v
		for(var attribute : product.getAttributes()) {
			var tmp = attributeRepository.getAttributesById(attribute.getId());
			attributes.add(attributeMapper.toAttributeDetail(tmp));
		}
		log.info("Product ID: {}", productId);
		var dto = productDetailMapper.toProductDetail(product);
		dto.setAttributes(attributes);
//		dto.setReviews(toReviewDetail(reviews));
		return dto;
	}
	private final DeliveryInfoRepository deliveryInfoRepository;
	private final DeliveryMapper deliveryMapper;
	@Override
	public UserDeliveryInfo getUserDeliveryInfo(String username) {
		return deliveryMapper.toUserDeliveryInfo(deliveryInfoRepository.findByUserId(username));
	}

	private List<ReviewDetail> toReviewDetail(List<Review> reviews) {
		List<ReviewDetail> reviewDetails = new ArrayList<>();
		for(var review : reviews) {
			reviewDetails.add(reviewMapper.toReviewDetail(review));
		}
		return reviewDetails;
	}
}
