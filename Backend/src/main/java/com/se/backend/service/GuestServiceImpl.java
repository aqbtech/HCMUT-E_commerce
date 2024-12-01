package com.se.backend.service;

import com.se.backend.constant.SystemConstant;
import com.se.backend.dto.request.UserRegister;
import com.se.backend.dto.response.*;
import com.se.backend.entity.*;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.mapper.AttributeMapper;
import com.se.backend.mapper.InstanceMapper;
import com.se.backend.mapper.ProductInfoMapper;
import com.se.backend.mapper.ProductSummaryMapper;
import com.se.backend.repository.*;
import com.se.backend.utils.PaginationUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class GuestServiceImpl implements GuestService {
	private final ProductRepository productRepository;
	private final AttributeRepository attributeRepository;
	private final ProductInstanceRepository productInstanceRepository;
	private final AttributeInsRepository attributeInsRepository;
	private final ReviewService reviewService;
	private final ProductInfoMapper productInfoMapper;
	private final ProductSummaryMapper productSummaryMapper;
	private final AttributeMapper attributeMapper;
	private final InstanceMapper instanceMapper;
	private final ProductService productService;
	private final BuyerRepository buyerRepository;
	private final PasswordEncoder passwordEncoder;

	private ProductDetail productDetailFactory(Product p, List<ProductInstance> pIs, List<Attribute> as) {
		var productDetail = productInfoMapper.toProductDetail(p);
		productDetail.setAttributes(attributeMapper.toAttributeDetails(as));
		productDetail.setTotalQuantityInStock(productService.totalQuantityInStock(p.getId()));
		// min price
		productDetail.setMinPrice(productService.minPriceOf(p.getId()));
		// max price
		productDetail.setMaxPrice(productService.maxPriceOf(p.getId()));
		// rating
		productDetail.setRating(reviewService.ratingCalculator(p.getId()));
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
		var product = productRepository.findProductDetailedById(productId)
				.orElseThrow(() -> new WebServerException(ErrorCode.PRODUCT_NOT_FOUND));
		var productInstances = productInstanceRepository.findByBuildProductProduct(product);
		return productDetailFactory(product,
				productInstances,
				attributeRepository.findByOfProduct(product));
	}

	@Override
	public Page<ReviewDetail> getReviews(String productId, Pageable pageable) {
		return reviewService.getReviews(productId, pageable);
	}

	@Override
	public Page<ProductSummary> getHomePage(int page) {
		// find all product with pageable, sort by name asc
		Pageable pageable = PageRequest.of(page, 10, Sort.by("name").ascending());
		Page<Product> products = productRepository.findAll(pageable);
		List<Product> productsList = products.getContent();
		return PaginationUtils.convertListToPage(productSummaryMapper.toProductSummaries(productsList), pageable);
	}

	@Override
	@Transactional
	public MinimalUserProfile register(UserRegister userRegister) {
		Buyer newBuyer = Buyer.builder()
				.username(userRegister.getUsername())
				.password(passwordEncoder.encode(userRegister.getPassword()))
				.firstName(userRegister.getFirstName())
				.lastName(userRegister.getLastName())
				.email(userRegister.getEmail())
				.phone(userRegister.getPhone())
				.dob(userRegister.getDob())
				.createdDate(java.time.LocalDate.now())
				.build();
		BuyerCartId buyerCartId = new BuyerCartId();
		buyerCartId.setUsername(newBuyer.getUsername());
		buyerCartId.setCartId(UUID.randomUUID().toString());
		Cart newCart = Cart.builder()
				.cartId(buyerCartId)
				.totalPrice(0.0)
				.totalQuantity(0L)
				.buyer(newBuyer)
				.build();
		newBuyer.setCart(newCart);
		try {
			buyerRepository.save(newBuyer);
		} catch (DataIntegrityViolationException e) {
			throw new WebServerException(ErrorCode.USER_EXISTED);
		} catch (Exception e) {
			log.error("Error when register new user {}", e.getMessage());
			throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
		}
		return MinimalUserProfile.builder()
				.username(newBuyer.getUsername())
				.totalQuantityInCart(0)
				.role(SystemConstant.ROLE_BUYER)
				.build();
	}
}
