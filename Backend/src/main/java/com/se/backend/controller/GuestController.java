package com.se.backend.controller;


import com.se.backend.dto.request.FilterProductRequest;
import com.se.backend.dto.request.UserRegister;
import com.se.backend.dto.request.UserSellerRegister;
import com.se.backend.dto.response.*;
import com.se.backend.service.GuestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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
@Tag(name = "Guest", description = "Api for guest users")
public class GuestController {
	private final GuestService guestService;

	@GetMapping("/query_product_detail")
	@Operation(
			summary = "Query product detail by productId",
			parameters = @Parameter(name = "productId", required = true, description = "ID of the product"),
			responses = {
					@ApiResponse(
							responseCode = "200", description = "Successful operation",
							content = @Content(
									schema = @Schema(implementation = ProductDetail.class)
							)
					),
					@ApiResponse(
							responseCode = "400", description = "Invalid productId supplied"
					),
					@ApiResponse(
							responseCode = "404", description = "Product not found"
					)
			}
	)
	public ResponseAPITemplate<ProductDetail> queryProductDetail(
			@RequestParam String productId
	) {
		// Xử lý dữ liệu productId ở đây
		var res = guestService.getProductDetail(productId);
		log.debug("Query product detail for productId: {}", productId);
		return ResponseAPITemplate.<ProductDetail>builder()
				.result(res)
				.build();
	}

	@GetMapping("/{productId}/reviews")
	@Operation(
			summary = "Query product reviews",
			parameters = {
					@Parameter(name = "productId", required = true, description = "ID of the product"),
					@Parameter(name = "page", description = "Page number for pagination", example = "0"),
					@Parameter(name = "size", description = "Number of reviews per page", example = "10")
			},
			responses = {
					@ApiResponse(
							responseCode = "200", description = "Successful operation",
							content = @Content(
									schema = @Schema(implementation = ReviewDetail.class),
									mediaType = "application/json"
							)
					),
					@ApiResponse(
							responseCode = "404", description = "Product not found"
					)
			}
	)
	public ResponseAPITemplate<Page<ReviewDetail>> queryProductReview(
			@PathVariable(value = "productId") String productId,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "10") int size
	) {
		Pageable pageable = Pageable.ofSize(size).withPage(page);
		Page<ReviewDetail> res = guestService.getReviews(productId, pageable);
		return ResponseAPITemplate.<Page<ReviewDetail>>builder()
				.result(res)
				.build();
	}

	@GetMapping("/home-page")
	@Operation(
			summary = "Get home page products",
			parameters = @Parameter(name = "page", description = "Page number for pagination", example = "0"),
			responses = {
					@ApiResponse(
							responseCode = "200", description = "Successful operation",
							content = @Content(
									schema = @Schema(implementation = ProductSummary.class),
									mediaType = "application/json"
							)
					)
			}
	)
	public ResponseAPITemplate<Page<ProductSummary>> getHomePage(
			@RequestParam(value = "page", defaultValue = "0") int page
	) {
		Page<ProductSummary> res = guestService.getHomePage(page);
		return ResponseAPITemplate.<Page<ProductSummary>>builder()
				.result(res)
				.build();
	}

	@Operation(
			summary = "Get all categories",
			responses = {
					@ApiResponse(
							responseCode = "200", description = "Successful operation",
							content = @Content(
									schema = @Schema(implementation = CategoryResponse.class),
									mediaType = "application/json"
							)
					)
			}
	)
	@GetMapping("/category")
	public ResponseAPITemplate<List<CategoryResponse>> getAllCategory() {
		List<CategoryResponse> res = guestService.getAllCategory();
		return ResponseAPITemplate.<List<CategoryResponse>>builder()
				.result(res)
				.build();
	}

	@Operation(
			summary = "Register a new user",
			requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
					description = "User registration details",
					content = @Content(
							schema = @Schema(implementation = UserRegister.class),
							mediaType = "application/json"
					),
					required = true
			),
			responses = {
					@ApiResponse(
							responseCode = "200", description = "Successful operation",
							content = @Content(
									schema = @Schema(implementation = CategoryResponse.class),
									mediaType = "application/json"
							)
					)
			}
	)
	@PostMapping("/register")
	public ResponseAPITemplate<?> register(
			@Valid @RequestBody UserRegister userRegister,
			BindingResult bindingResult
	) {
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


	@Operation(
			summary = "Register a new seller",
			requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
					description = "Seller registration details",
					content = @Content(
							schema = @Schema(implementation = UserSellerRegister.class),
							mediaType = "application/json"
					),
					required = true
			),
			responses = {
					@ApiResponse(
							responseCode = "200", description = "Successful operation",
							content = @Content(
									schema = @Schema(implementation = MinimalUserProfile.class),
									mediaType = "application/json"
							)
					)
			}
	)
	@PostMapping("/sellerregister")
	public ResponseAPITemplate<?> sellerRegister(
			@Valid @RequestBody UserSellerRegister userRegister,
			BindingResult bindingResult
	) {
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


	@Operation(
			summary = "Get product search results",
			parameters = {
					@Parameter(name = "keyword", description = "Search keyword", example = "laptop"),
					@Parameter(name = "page", description = "Page number for pagination", example = "0"),
					@Parameter(name = "sort", description = "Sort by field", example = "name")
			},
			responses = {
					@ApiResponse(
							responseCode = "200", description = "Successful operation",
							content = @Content(
									schema = @Schema(implementation = SearchFilterResponse.class),
									mediaType = "application/json"
							)
					)
			}
	)
	@GetMapping("/search")
	public ResponseAPITemplate<SearchFilterResponse> searchProduct(
			@RequestParam(value = "keyword", defaultValue = "") String keyword,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "sort", defaultValue = "name") String sort
	) {
		SearchFilterResponse res = guestService.searchByKeyword(keyword, page, sort);
		return ResponseAPITemplate.<SearchFilterResponse>builder()
				.result(res)
				.build();
	}

	@Operation(
			summary = "Filter products based on criteria",
			requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
					description = "Filter criteria for products",
					content = @Content(
							schema = @Schema(implementation = FilterProductRequest.class),
							mediaType = "application/json"
					)
			),
			parameters = {
					@Parameter(name = "keyword", description = "Search keyword", example = "laptop"),
					@Parameter(name = "page", description = "Page number for pagination", example = "0"),
					@Parameter(name = "sort", description = "Sort by field", example = "name")
			},
			responses = {
					@ApiResponse(
							responseCode = "200", description = "Successful operation",
							content = @Content(
									schema = @Schema(implementation = SearchFilterResponse.class),
									mediaType = "application/json"
							)
					)
			}
	)
	@PostMapping("/search/filter")
	public ResponseAPITemplate<SearchFilterResponse> search_filterProduct(
			@RequestParam(value = "keyword", defaultValue = "") String keyword,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "sort", defaultValue = "name") String sort,
			@RequestBody FilterProductRequest request
	) {
		SearchFilterResponse res = guestService.filterProducts(keyword, page, sort, request);
		return ResponseAPITemplate.<SearchFilterResponse>builder()
				.result(res)
				.build();
	}

	@Operation(
		summary = "Get shop information for guest users",
		parameters = @Parameter(name = "shop", required = true, description = "Shop name"),
		responses = {
				@ApiResponse(
						responseCode = "200", description = "Successful operation",
						content = @Content(
								schema = @Schema(implementation = ShopInfoForGuestResponse.class)
						)
				),
				@ApiResponse(
						responseCode = "404", description = "Shop not found"
				)
		}
	)
	@GetMapping("/shop_information")
	public ResponseAPITemplate<ShopInfoForGuestResponse> getShopInfo(
			@AuthenticationPrincipal Jwt jwt,
			@RequestParam("shop") String sellername
	) {
		String buyername = (jwt != null) ? jwt.getSubject() : "guest";
		ShopInfoForGuestResponse response = guestService.getShopInformation(buyername, sellername);
		return ResponseAPITemplate.<ShopInfoForGuestResponse>builder()
				.result(response)
				.build();
	}

	@Operation(
			summary = "Get shop products for guest users",
			parameters = {
					@Parameter(name = "shop", description = "Shop name", required = true),
					@Parameter(name = "page", description = "Page number for pagination", example = "0"),
					@Parameter(name = "sort", description = "Sort by field", example = "name"),
					@Parameter(name = "category", description = "Product category", example = "Ao")
			},
			responses = {
					@ApiResponse(
							responseCode = "200", description = "Successful operation",
							content = @Content(
									schema = @Schema(implementation = ShopProductForGuestResponse.class)
							)
					),
					@ApiResponse(
							responseCode = "404", description = "Shop not found"
					)
			}
	)
	@GetMapping("/shop_product")
	public ResponseAPITemplate<ShopProductForGuestResponse> getShopInfo(
			@RequestParam("shop") String sellername,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "sort", defaultValue = "name") String sort,
			@RequestParam(value = "category", defaultValue = "") String category
	) {
		ShopProductForGuestResponse response = guestService.shopFilterProducts(sellername, page, sort, category);
		return ResponseAPITemplate.<ShopProductForGuestResponse>builder()
				.result(response)
				.build();
	}
}
