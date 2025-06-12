package com.se.backend.controller.web;

import com.se.backend.dto.request.*;
import com.se.backend.dto.response.*;
import com.se.backend.service.IProductManagementSerivce;
import com.se.backend.service.SellerService;
import com.se.backend.service.business.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@Slf4j
@RequestMapping(value = "/seller")
@Tag(name = "Seller", description = "Api for seller users")
public class SellerController {

	private final IProductManagementSerivce productManagementService;
	private final OrderService orderService;
	private final SellerService sellerService;

	@Autowired
	public SellerController(
			IProductManagementSerivce productManagementService,
			OrderService orderService,
			SellerService sellerService
	) {
		this.productManagementService = productManagementService;
		this.orderService = orderService;
		this.sellerService = sellerService;
	}

	@GetMapping("/shop_information")
	public ResponseAPITemplate<ShopInformationResponse> getShopInfo(
			@RequestParam String username
	) {
		ShopInformationResponse response = sellerService.getShopInformation(username);
		return ResponseAPITemplate.<ShopInformationResponse>builder()
				.result(response)
				.build();
	}

	@GetMapping("/status_seller")
	public ResponseAPITemplate<Boolean> statusSeller(
			@RequestParam("id") String sellerId
	) {
		Boolean res = sellerService.statusSeller(sellerId);
		return ResponseAPITemplate.<Boolean>builder()
				.result(res)
				.build();
	}

	@PutMapping("/update_information")
	public ResponseAPITemplate<String> updateInfo(
			@RequestParam String username,
			@RequestBody UpdateShopInformationRequest request
	) {
		String response = sellerService.updateShopInformation(username, request);
		return ResponseAPITemplate.<String>builder()
				.message(response)
				.build();
	}

	@PutMapping("/approve_order")
	public ResponseAPITemplate<ApproveOrderResponse> approveOrder(
			@RequestBody ApproveOrderRequest request
	) {
		log.info(request.getOrderId());
		ApproveOrderResponse response = orderService.approveOrder(request);
		return ResponseAPITemplate.<ApproveOrderResponse>builder()
				.message(response.getMsg())
				.build();
	}

	@PutMapping("/delete_order")
	public ResponseAPITemplate<CancelOrderResponse> cancelOrder(
			@RequestBody CancelOrderRequest request
	) {
		CancelOrderResponse response = orderService.cancelOrder(request);
		return ResponseAPITemplate.<CancelOrderResponse>builder()
				.message(response.getMsg())
				.build();
	}

	@GetMapping("/approved_order/{username}")
	public ResponseAPITemplate<Page<GetOrderResponse>> getApprovedOrder(
			@PathVariable("username") String username,
			@RequestParam Optional<Integer> page,
			@RequestParam Optional<Integer> limit
	) {
		Pageable pageable = PageRequest.of(page.orElse(0), limit.orElse(10));
		Page<GetOrderResponse> response = orderService.getApprovedOrder(username, pageable);
		if (response == null || response.isEmpty()) {
			return ResponseAPITemplate.<Page<GetOrderResponse>>builder()
					.message("does not have any order")
					.result(response)
					.build();
		}
		return ResponseAPITemplate.<Page<GetOrderResponse>>builder()
				.result(response)
				.build();
	}

	@GetMapping("/waiting_order/{username}")
	public ResponseAPITemplate<Page<GetOrderResponse>> getWaitingOrder(
			@PathVariable("username") String username,
			@RequestParam Optional<Integer> page,
			@RequestParam Optional<Integer> limit
	) {
		Pageable pageable = PageRequest.of(page.orElse(0), limit.orElse(10));
		Page<GetOrderResponse> response = orderService.getWaitingOrder(username, pageable);
		if (response == null || response.isEmpty()) {
			return ResponseAPITemplate.<Page<GetOrderResponse>>builder()
					.message("does not have any order")
					.result(response)
					.build();
		}
		return ResponseAPITemplate.<Page<GetOrderResponse>>builder()
				.result(response)
				.build();
	}


	@GetMapping("/cancelled_order/{username}")
	public ResponseAPITemplate<Page<GetOrderResponse>> getCancelledOrder(
			@PathVariable("username") String username,
			@RequestParam Optional<Integer> page,
			@RequestParam Optional<Integer> limit
	) {
		Pageable pageable = PageRequest.of(page.orElse(0), limit.orElse(10));
		Page<GetOrderResponse> response = orderService.getCancelledOrder(username, pageable);
		if (response == null || response.isEmpty()) {
			return ResponseAPITemplate.<Page<GetOrderResponse>>builder()
					.message("does not have any order")
					.result(response)
					.build();
		}
		return ResponseAPITemplate.<Page<GetOrderResponse>>builder()
				.result(response)
				.build();
	}

	@GetMapping("/shipping_order/{username}")
	public ResponseAPITemplate<Page<GetOrderResponse>> getShippingOrder(
			@PathVariable("username") String username,
			@RequestParam Optional<Integer> page,
			@RequestParam Optional<Integer> limit
	) {
		Pageable pageable = PageRequest.of(page.orElse(0), limit.orElse(10));
		Page<GetOrderResponse> response = orderService.getShippingOrder(username, pageable);
		if (response == null || response.isEmpty()) {
			return ResponseAPITemplate.<Page<GetOrderResponse>>builder()
					.message("does not have any order")
					.result(response)
					.build();
		}
		return ResponseAPITemplate.<Page<GetOrderResponse>>builder()
				.result(response)
				.build();
	}


	@GetMapping("/completed_order/{username}")
	public ResponseAPITemplate<Page<GetOrderResponse>> getCompletedOrder(
			@PathVariable("username") String username,
			@RequestParam Optional<Integer> page,
			@RequestParam Optional<Integer> limit
	) {
		Pageable pageable = PageRequest.of(page.orElse(0), limit.orElse(10));
		Page<GetOrderResponse> response = orderService.getCompletedOrder(username, pageable);
		if (response == null || response.isEmpty()) {
			return ResponseAPITemplate.<Page<GetOrderResponse>>builder()
					.message("does not have any order")
					.result(response)
					.build();
		}
		return ResponseAPITemplate.<Page<GetOrderResponse>>builder()
				.result(response)
				.build();
	}


	@PostMapping("/add")
	public ResponseAPITemplate<AddProductToShopResponse> addProductToShop(
			@RequestBody AddProductToShopRequest addProductToShopRequest
	) {
		AddProductToShopResponse response = productManagementService.addProductToShop(addProductToShopRequest);
		return ResponseAPITemplate.<AddProductToShopResponse>builder()
				.result(response)
				.build();
	}

	@PutMapping("/update")
	public ResponseAPITemplate<UpdateProductInShopResponse> updateProductInShop(
			@RequestBody UpdateProductRequest updateProductRequest
	) {
		UpdateProductInShopResponse response = productManagementService.updateProductInShop(updateProductRequest);
		return ResponseAPITemplate.<UpdateProductInShopResponse>builder()
				.message(response.getMsg())
				.build();
	}

	@GetMapping("/all-product")
	public ResponseAPITemplate<Page<ProductSummaryResponseForSeller>> getAllProductOfSeller(
			@AuthenticationPrincipal Jwt jwt,
			@RequestParam(value = "page", defaultValue = "0") int page
	) {
		String username = jwt.getSubject();
		Page<ProductSummaryResponseForSeller> res = productManagementService.getAllProduct(username, page);
		return ResponseAPITemplate.<Page<ProductSummaryResponseForSeller>>builder()
				.result(res)
				.build();
	}

	@PutMapping("/enabled-product")
	public ResponseAPITemplate<ChangeStatusOfProduct> enabledProduct(
			@RequestParam("productId") String productId
	) {
		ChangeStatusOfProduct response = productManagementService.enabledProduct(productId);
		return ResponseAPITemplate.<ChangeStatusOfProduct>builder()
				.message(response.getMsg())
				.build();
	}

	@PutMapping("/disabled-product")
	public ResponseAPITemplate<ChangeStatusOfProduct> disabledProduct(
			@RequestParam("productId") String productId
	) {
		ChangeStatusOfProduct response = productManagementService.disabledProduct(productId);
		return ResponseAPITemplate.<ChangeStatusOfProduct>builder()
				.message(response.getMsg())
				.build();
	}

	@GetMapping("/detailed-product")
	public ResponseAPITemplate<GetDetailProductResponse> getDetailProduct(
			@RequestParam("productId") String productId
	) {
		GetDetailProductResponse response = productManagementService.getDetailProduct(productId);
		return ResponseAPITemplate.<GetDetailProductResponse>builder()
				.result(response)
				.build();
	}
}
