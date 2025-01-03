package com.se.backend.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.se.backend.dto.request.FilterProductRequest;
import com.se.backend.dto.request.UserRegister;
import com.se.backend.dto.request.UserSellerRegister;
import com.se.backend.dto.response.*;
import com.se.backend.service.GuestService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(name = "Sample API", description = "Sample operations for demonstration")
public class GuestController {
	private final GuestService guestService;

	@GetMapping("/query_product_detail")
	public ResponseAPITemplate<ProductDetail> queryProductDetail(@RequestParam String productId) {
		// Xử lý dữ liệu productId ở đây
		var res = guestService.getProductDetail(productId);
		System.out.println("Product ID: " + productId);
		return ResponseAPITemplate.<ProductDetail>builder()
				.result(res)
				.build();
	}

	@GetMapping("/{productId}/reviews")
	public ResponseAPITemplate<Page<ReviewDetail>> queryProductReview(
			@PathVariable(value = "productId") String productId,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "10") int size) {
		Pageable pageable = Pageable.ofSize(size).withPage(page);
		Page<ReviewDetail> res = guestService.getReviews(productId, pageable);
		return ResponseAPITemplate.<Page<ReviewDetail>>builder()
				.result(res)
				.build();
	}

	@GetMapping("/home-page")
	public ResponseAPITemplate<Page<ProductSummary>> getHomePage(
			@RequestParam(value = "page", defaultValue = "0") int page) {
		Page<ProductSummary> res = guestService.getHomePage(page);
		return ResponseAPITemplate.<Page<ProductSummary>>builder()
				.result(res)
				.build();
	}

	@GetMapping("/category")
	public ResponseAPITemplate<List<CategoryResponse>> getAllCategory() {
		List<CategoryResponse> res = guestService.getAllCategory();
		return ResponseAPITemplate.<List<CategoryResponse>>builder()
				.result(res)
				.build();
	}
	@PostMapping("/register")
	public ResponseAPITemplate<?> register(@Valid @RequestBody UserRegister userRegister, BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			return ResponseAPITemplate.<List<ObjectError>>builder()
					.code(400)
					.message("Invalid input")
					.result(bindingResult.getAllErrors())
					.build();
		}
		MinimalUserProfile res = guestService.register(userRegister);
		return ResponseAPITemplate.<MinimalUserProfile>builder()
				.result(res)
				.build();
	}

	@PostMapping("/sellerregister")
	public ResponseAPITemplate<?> sellerRegister(@Valid @RequestBody UserSellerRegister userRegister, BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			return ResponseAPITemplate.<List<ObjectError>>builder()
					.code(400)
					.message("Invalid input")
					.result(bindingResult.getAllErrors())
					.build();
		}
		MinimalUserProfile res = guestService.sellerRegister(userRegister);
		return ResponseAPITemplate.<MinimalUserProfile>builder()
				.result(res)
				.build();
	}

	@GetMapping("/search")
	public ResponseAPITemplate<SearchFilterResponse> searchProduct(
			@RequestParam(value = "keyword", defaultValue = "") String keyword,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "sort", defaultValue = "name") String sort
	){
		SearchFilterResponse res = guestService.searchByKeyword(keyword, page, sort);
		return ResponseAPITemplate.<SearchFilterResponse>builder()
				.result(res)
				.build();
	}
	@PostMapping("/search/filter")
	public ResponseAPITemplate<SearchFilterResponse> search_filterProduct(
			@RequestParam(value = "keyword", defaultValue = "") String keyword,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "sort", defaultValue = "name") String sort,
			@RequestBody FilterProductRequest request
	){
		SearchFilterResponse res = guestService.filterProducts(keyword, page, sort, request);
		return ResponseAPITemplate.<SearchFilterResponse>builder()
				.result(res)
				.build();
	}
	@GetMapping("/shop_information")
	public ResponseAPITemplate<ShopInfoForGuestResponse> getShopInfo(
			@AuthenticationPrincipal Jwt jwt,
			@RequestParam("shop") String sellername){
		String buyername = (jwt != null) ? jwt.getSubject() : "guest";
		ShopInfoForGuestResponse response = guestService.getShopInformation(buyername, sellername);
		return ResponseAPITemplate.<ShopInfoForGuestResponse>builder()
				.result(response)
				.build();
	}

	@GetMapping("/shop_product")
	public ResponseAPITemplate<ShopProductForGuestResponse> getShopInfo(
			@AuthenticationPrincipal Jwt jwt,
			@RequestParam("shop") String sellername,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "sort", defaultValue = "name") String sort,
			@RequestParam(value = "category", defaultValue = "") String category){
		ShopProductForGuestResponse response = guestService.shopFilterProducts(sellername, page, sort, category);
		return ResponseAPITemplate.<ShopProductForGuestResponse>builder()
				.result(response)
				.build();
	}
}
