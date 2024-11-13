package com.se.backend.service;

import com.se.backend.dto.response.*;
import com.se.backend.entity.*;
import com.se.backend.mapper.*;
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
	private final ProductInstanceRepository productInstanceRepository;
	private final AttributeInsRepository attributeInsRepository;
	@Autowired
	private ProductDetailMapper productDetailMapper;
	@Autowired
	private AttributeMapper attributeMapper;
	@Autowired
	private ReviewMapper reviewMapper;

	private Double ratingCalculator() {
		// will be call review service
		return 5.0;
	}
	private Long totalQuantityInStock(List<ProductInstance> productInstances) {
		return productInstances.stream().mapToLong(ProductInstance::getQuantityInStock).sum();
	}
	@Autowired
	private InstanceMapper instanceMapper;
	@Autowired
	private AttributeInstanceMapper attributeInstanceMapper;
	private ProductDetail productDetailFactory(Product p, List<ProductInstance> pIs, List<Attribute> as) {
		var productDetail = productDetailMapper.toProductDetail(p);
		productDetail.setAttributes(attributeMapper.toAttributeDetails(as));
		productDetail.setTotalQuantityInStock(totalQuantityInStock(pIs));
		// min price
		productDetail.setMinPrice(pIs.stream().mapToDouble(ProductInstance::getPrice).min().orElse(0));
		// max price
		productDetail.setMaxPrice(pIs.stream().mapToDouble(ProductInstance::getPrice).max().orElse(0));
		// rating
		productDetail.setRating(ratingCalculator());
		// instants list
		List<Instant> instants = instanceMapper.toInstants(pIs);
		for( Attribute ai : as ) {
			var attributeInstances = attributeInsRepository.findByAttribute(ai);
			for( AttributeInstance attributeInstance : attributeInstances ) {
				for( Instant instant : instants ) {
					instant.setAttributes(attributeInstanceMapper.toAttributeInstanceMap(attributeInstance));
				}
			}
		}
		productDetail.setInstants(instants);
		return productDetail;
	}
	@Override
	public ProductDetail getProductDetail(String productId) {
		var product = productRepository.findProductById(productId);
		var productInstances = productInstanceRepository.findByBuildProductProduct(product);
		var dto = productDetailFactory(product,
				productInstances,
				attributeRepository.findByOfProduct(product));
		log.info("Product ID: {}", productId);
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
