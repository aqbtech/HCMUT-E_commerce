package com.se.backend.service;

import com.se.backend.dto.response.Instant;
import com.se.backend.dto.response.ProductDetail;
import com.se.backend.dto.response.ReviewDetail;
import com.se.backend.dto.response.UserDeliveryInfo;
import com.se.backend.entity.Attribute;
import com.se.backend.entity.Product;
import com.se.backend.entity.ProductInstance;
import com.se.backend.entity.Review;
import com.se.backend.mapper.*;
import com.se.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class GuestServiceImpl implements GuestService {
	private final ProductRepository productRepository;
	private final AttributeRepository attributeRepository;
	private final ProductInstanceRepository productInstanceRepository;
	private final AttributeInsRepository attributeInsRepository;
	private final DeliveryInfoRepository deliveryInfoRepository;
	private final DeliveryMapper deliveryMapper;
	@Autowired
	private ProductDetailMapper productDetailMapper;
	@Autowired
	private AttributeMapper attributeMapper;
	@Autowired
	private ReviewMapper reviewMapper;
	@Autowired
	private InstanceMapper instanceMapper;

	private Double ratingCalculator() {
		// will be call review service
		return 5.0;
	}

	private Long totalQuantityInStock(List<ProductInstance> productInstances) {
		return productInstances.stream().mapToLong(ProductInstance::getQuantityInStock).sum();
	}

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
		// for each instant add all attributes in as and value is it own value
		Map<String, String> attributeMapTemplate = new HashMap<>();
		for (var att : as) {
			attributeMapTemplate.put(att.getName(), "");
		}
		for (int i = 0; i < instants.size(); i++) {
			var pIi = pIs.get(i);
			// add each attribute instance to attributeMapTemplate and set value
			var attIAs = attributeInsRepository.findAttributeInstancesBy(pIi);
			Map<String, String> attributeMap = new HashMap<>(attributeMapTemplate);
			for (var attIA : attIAs) {
				attributeMap.put(attIA.getAttribute().getName(), attIA.getValue());
			}
			instants.get(i).setAttributes(attributeMap);
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

	@Override
	public UserDeliveryInfo getUserDeliveryInfo(String username) {
		return deliveryMapper.toUserDeliveryInfo(deliveryInfoRepository.findByUserId(username));
	}

	private List<ReviewDetail> toReviewDetail(List<Review> reviews) {
		List<ReviewDetail> reviewDetails = new ArrayList<>();
		for (var review : reviews) {
			reviewDetails.add(reviewMapper.toReviewDetail(review));
		}
		return reviewDetails;
	}
}
