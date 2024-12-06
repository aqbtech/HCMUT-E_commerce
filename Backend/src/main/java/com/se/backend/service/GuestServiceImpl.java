package com.se.backend.service;


import com.se.backend.dto.request.UserSellerRegister;
import com.se.backend.dto.response.*;
import com.se.backend.entity.Attribute;
import com.se.backend.entity.Category;
import com.se.backend.entity.Product;
import com.se.backend.entity.ProductInstance;

import com.se.backend.constant.SystemConstant;
import com.se.backend.dto.request.FilterProductRequest;
import com.se.backend.dto.request.UserRegister;
import com.se.backend.entity.*;

import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.mapper.*;
import com.se.backend.repository.*;


import com.se.backend.service.searchService.ProductSpecification;

import com.se.backend.service.storage.FileService;
import com.se.backend.utils.PaginationUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import java.util.*;


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
	private final SellerRepository sellerRepository;
	private final ReviewContentRepository reviewContentRepository;
	private final AddressMapper addressMapper;
	private final FollowRepository followRepository;
	private final AddressRepository addressRepository;


	private final CategoryRepository categoryRepository;

	private final BuyerRepository buyerRepository;
	private final PasswordEncoder passwordEncoder;
	private final FileService fileService;
	private final ShopPolicyRepository shopPolicyRepository;
	private final CategoryPolicyRepository categoryPolicyRepository;


	private ProductDetail productDetailFactory(Product p, List<ProductInstance> pIs, List<Attribute> as) {
		var productDetail = productInfoMapper.toProductDetail(p);
		List<ShopPolicy> shopPolicy = shopPolicyRepository.findBySellerId(p.getSeller().getUsername());
		shopPolicy.sort(Comparator.comparing(ShopPolicy::getSale).reversed());
		List<CategoryPolicy> categoryPolicy = categoryPolicyRepository.findCategoryId(p.getCategory().getRichTextName());
		categoryPolicy.sort(Comparator.comparing(CategoryPolicy::getSale).reversed());
		Double shopSale = 0.0;
		Double cateSale = 0.0;
		for (ShopPolicy shop: shopPolicy){
			if(shop.getCount() > 0){
				shopSale = shop.getSale();
				break;
			}
		}
		for (CategoryPolicy cate: categoryPolicy){
			if(cate.getSale() > cateSale && cate.getCount() > 0 ){
				cateSale = cate.getSale();
				break;
			}
		}
		double totalSale = shopSale + cateSale;
		totalSale = totalSale > 1 ? 1 : totalSale;
		productDetail.setSale(totalSale);
		if (as.getFirst().getName() != null) {
			productDetail.setAttributes(attributeMapper.toAttributeDetails(as));
		} else {
			productDetail.setAttributes(new ArrayList<>());
		}
		productDetail.setTotalQuantityInStock(productService.totalQuantityInStock(p.getId()));
		// min price
		productDetail.setMinPrice(productService.minPriceOf(p.getId()));
		// max price
		productDetail.setMaxPrice(productService.maxPriceOf(p.getId()));
		// rating
		productDetail.setRating(reviewService.ratingCalculator(p.getId()));
		// list img
		productDetail.setImagesPublicLink(fileService.listFiles(p.getId()));
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
			boolean hasNull = false;
			for (var attIA : attIAs) {
				String key = attIA.getAttribute().getName();
				String value = attIA.getValue();
				if (key != null) {
					attributeMap.put(key, value);
				} else {
					hasNull = true;
					log.error("Attribute instance has no attribute");
				}
			}
			if (!hasNull) {
				instants.get(i).setAttributes(attributeMap);
			} else {
				instants.get(i).setAttributes(new HashMap<>()); // or null
			}
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
		Pageable pageable = PageRequest.of(page, 5, Sort.by("name").ascending());
		Page<Product> products = productRepository.findAll(pageable);
		List<Product> productsList = products.getContent();
		return PaginationUtils.convertListToPage(productSummaryMapper.toProductSummaries(productsList), pageable,(int) products.getTotalElements());
	}

	@Override
	public List<CategoryResponse> getAllCategory() {
		List<Category> categories = categoryRepository.findAll();
		List<CategoryResponse> cgres = categories.stream()
				.map(category -> new CategoryResponse(category.getRichTextName()))
				.collect(Collectors.toList());
		return cgres;
	}

	@Transactional(value = Transactional.TxType.REQUIRES_NEW)
	public MinimalUserProfile sellerRegister(UserSellerRegister userRegister) {
		Address address = Address.builder()
				.province(userRegister.getProvince())
				.district(userRegister.getDistrict())
				.commune(userRegister.getWard())
				.specificAddress(userRegister.getDetailAddress())
				.build();
		try{
			addressRepository.save(address);
		}
		catch (WebServerException e){
			throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
		}

		Seller newSeller = Seller.builder()
				.username(userRegister.getUsername())
				.password(passwordEncoder.encode(userRegister.getPassword()))
				.address(address)
				.followers(0)
				.status(Boolean.FALSE)
				.shopName(userRegister.getShopName())
				.email(userRegister.getEmail())
				.phone(userRegister.getPhone())
				.createdDate(LocalDate.now())
				.build();
		BuyerCartId buyerCartId = new BuyerCartId();
		buyerCartId.setUsername(newSeller.getUsername());
		buyerCartId.setCartId(UUID.randomUUID().toString());
		try {
			sellerRepository.saveAndFlush(newSeller);
		} catch (DataIntegrityViolationException e) {
			throw new WebServerException(ErrorCode.USER_EXISTED);
		} catch (Exception e) {
			log.error("Error when register new user {}", e.getMessage());
			throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
		}
		return MinimalUserProfile.builder()
				.username(newSeller.getUsername())
				.role(SystemConstant.ROLE_SELLER)
				.build();
	}

	@Transactional(value = Transactional.TxType.REQUIRES_NEW)
	public MinimalUserProfile register(UserRegister userRegister) {
		Buyer newBuyer = Buyer.builder()
				.username(userRegister.getUsername())
				.password(passwordEncoder.encode(userRegister.getPassword()))
				.firstName(userRegister.getFirstName())
				.lastName(userRegister.getLastName())
				.email(userRegister.getEmail())
				.phone(userRegister.getPhone())
				.dob(userRegister.getDob())
				.createdDate(LocalDate.now())
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
			buyerRepository.saveAndFlush(newBuyer);
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

	@Override
	public SearchFilterResponse searchByKeyword(String keyword, int page, String sort){
		Pageable pageable = PageRequest.of(page, 10, Sort.by("name").ascending());
		Page<Product> products = productRepository.findByNameContaining(keyword, pageable);

		List<Product> productsList = products.getContent();
		List<ProductSummary> productSummaries = productSummaryMapper.toProductSummaries(productsList);

		if ("asc".equalsIgnoreCase(sort)) {
			productSummaries.sort(Comparator.comparing(ProductSummary::getMinPrice));
		} else if ("desc".equalsIgnoreCase(sort)) {
			productSummaries.sort(Comparator.comparing(ProductSummary::getMinPrice).reversed());
		}

		List<String> ratings = List.of("0-1", "1-2", "2-3", "3-4", "4-5");
		List<String> categories = this.getCategoriesForFilter(productsList);
		List<String> locations = this.getLocationsForFilter(productsList);
		FilterResponse filterResponse = FilterResponse.builder()
				.categories(categories)
				.locations(locations)
				.ratings(ratings)
				.build();
		FilterValueResponse filterValueResponse = FilterValueResponse.builder()
				.categories(new ArrayList<>())
				.locations(new ArrayList<>())
				.ratings(new ArrayList<>())
				.build();
		Page<ProductSummary> productSummaryPage = PaginationUtils.convertListToPage(productSummaries, pageable);
		return SearchFilterResponse.builder()
				.productSummaryPage(productSummaryPage)
				.available(filterResponse)
				.filter(filterValueResponse)
				.build();
	}

	private List<Product> filterByRating(List<Product> productsList, List<String> ranges){
		List<Double> left = new ArrayList<>();
		List<Double> right = new ArrayList<>();
		for(String range : ranges){
			String[] bounds = range.split("-");
			double lowerBound = Double.parseDouble(bounds[0]);
			double upperBound = Double.parseDouble(bounds[1]);
			left.add(lowerBound); right.add(upperBound);
		}
		List<Product> res = new ArrayList<>();
		for(Product product: productsList){
			Double rating = reviewService.ratingCalculator(product.getId());
			for(int i = 0; i < left.size(); i ++){
				if(rating >= left.get(i) && rating <= right.get(i)){
                    res.add(product);
					break;
				}
			}
		}
		return res;
	}


	public SearchFilterResponse filterProducts(String keyword, int page, String sort, FilterProductRequest request) {
		Pageable pageable = PageRequest.of(page, 10, Sort.by("name").ascending());
		Specification<Product> spec = Specification.where(ProductSpecification.hasCategories(request.getCategories()))
				.and(ProductSpecification.hasLocation(request.getLocations()));
//				.and(ProductSpecification.hasRatingIn(request.getRatings()));

		// Nếu có keyword, thêm điều kiện tìm kiếm
		if (keyword != null && !keyword.trim().isEmpty()) {
			spec = spec.and((root, query, criteriaBuilder) ->
					criteriaBuilder.like(root.get("name"), "%" + keyword + "%"));
		}

		List<Product> productsList = productRepository.findAll(spec);
		if(!request.getRatings().isEmpty()){
			productsList = this.filterByRating(productsList, request.getRatings());
		}
		List<ProductSummary> productSummaries = productSummaryMapper.toProductSummaries(productsList);
		if ("asc".equalsIgnoreCase(sort)) {
			productSummaries.sort(Comparator.comparing(ProductSummary::getMinPrice));
		} else if ("desc".equalsIgnoreCase(sort)) {
			productSummaries.sort(Comparator.comparing(ProductSummary::getMinPrice).reversed());
		}
		List<String> ratings = List.of("0-1", "1-2", "2-3", "3-4", "4-5");
		List<String> categories = this.getCategoriesForFilter(productsList);
		List<String> locations = this.getLocationsForFilter(productsList);
		FilterResponse a = FilterResponse.builder().build();
		FilterResponse filterResponse = FilterResponse.builder()
				.categories(categories)
				.locations(locations)
				.ratings(ratings)
				.build();
		FilterValueResponse filterValueResponse = FilterValueResponse.builder()
				.categories(request.getCategories())
				.locations(request.getLocations())
				.ratings(request.getRatings())
				.build();
		Page<ProductSummary> productSummaryPage = PaginationUtils.convertListToPage(productSummaries, pageable, productsList.size());
		return SearchFilterResponse.builder()
				.productSummaryPage(productSummaryPage)
				.available(filterResponse)
				.filter(filterValueResponse)
				.build();
	}
	private List<String> getCategoriesForFilter(List<Product> productsList){
		return productsList.stream()
				.map(product -> product.getCategory().getRichTextName())
				.distinct()
				.sorted()
				.toList();
	}
	private List<String> getLocationsForFilter(List<Product> productsList){
		return productsList.stream()
				.map(product -> product.getSeller().getAddress().getProvince())
				.distinct()
				.sorted()
				.toList();
	}

	@Override
	public ShopInfoForGuestResponse getShopInformation(String buyername, String sellername) {
		Seller seller = sellerRepository.findByUsername(sellername)
				.orElseThrow(()-> new WebServerException(ErrorCode.USER_NOT_FOUND));
		Integer follower  = seller.getFollowers();
		Address address = seller.getAddress();
		double rating;
		int numberOfProduct;
		try{
			List<Product> products = productRepository.findBySeller(seller);
			numberOfProduct = products.size();
		}
		catch (WebServerException e){
			throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
		}
		try{
			List<ReviewContent> reviewContentList = reviewContentRepository.findBySeller(seller);
			rating = reviewContentList.stream()
					.filter(review -> review.getRating() != null)
					.mapToDouble(ReviewContent::getRating)
					.average()
					.orElse(0);
		}
		catch (WebServerException e){
			throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
		}

		ShopAddressResponse shopAddressResponse = addressMapper.toShopAddressResponse(address);
		String addressResponse = String.join(",",
				shopAddressResponse.getSpecific_address(),
				shopAddressResponse.getCommune(),
				shopAddressResponse.getDistrict(),
				shopAddressResponse.getProvince());
		boolean isFollowed = false;
		if(!"guest".equals(buyername)){
			isFollowed = followRepository.existsByBuyerAndSeller(buyername, sellername);
		}
		ShopInfoForGuestResponse response = ShopInfoForGuestResponse.builder()
				.shopName(seller.getShopName())
				.followers(follower)
				.numberOfProduct(numberOfProduct)
				.rating(rating)
				.address(addressResponse)
				.isFollowed(isFollowed)
				.build();
		return response;
	}

	@Override
	public ShopProductForGuestResponse shopFilterProducts(String seller, int page, String sort, String category){
		Pageable pageable = PageRequest.of(page, 10, Sort.by("name").ascending());
		Specification<Product> spec = Specification.where(ProductSpecification.hasCategories(Collections.singletonList(category)));
		Seller sellerObj = sellerRepository.findByUsername(seller)
				.orElseThrow(()-> new WebServerException(ErrorCode.USER_NOT_FOUND));
		// Nếu có keyword, thêm điều kiện tìm kiếm
//		if (seller != null && !seller.trim().isEmpty()) {
//			spec = spec.and((root, query, criteriaBuilder) ->
//					criteriaBuilder.like(root.get("seller").get("username"), "%" + seller + "%"));
//		}

		List<Product> productsList = productRepository.findBySeller(sellerObj);
		if(!category.equals("")){
			productsList = productsList.stream().filter(product -> product
					.getCategory()
					.getRichTextName().equals(category)).toList();
		}
		List<ProductSummary> productSummaries = productSummaryMapper.toProductSummaries(productsList);
		if ("asc".equalsIgnoreCase(sort)) {
			productSummaries.sort(Comparator.comparing(ProductSummary::getMinPrice));
		} else if ("desc".equalsIgnoreCase(sort)) {
			productSummaries.sort(Comparator.comparing(ProductSummary::getMinPrice).reversed());
		}
		PaginationUtils.convertListToPage(productSummaries, pageable);
		List<String> categories = this.getCategoriesForFilter(productsList);
        Page<ProductSummary> productSummaryPage = PaginationUtils.convertListToPage(productSummaries, pageable);
		return ShopProductForGuestResponse.builder()
				.productSummaryPage(productSummaryPage)
				.categories(categories)
				.categoryValue(category)
				.build();
	};
}
