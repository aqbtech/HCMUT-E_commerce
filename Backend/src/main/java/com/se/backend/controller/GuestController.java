package com.se.backend.controller;

import com.se.backend.dto.response.ProductDetail;
import com.se.backend.dto.response.ResponseAPITemplate;
import com.se.backend.dto.response.ReviewDetail;
import com.se.backend.dto.response.UserDeliveryInfo;
import com.se.backend.service.GuestService;
import com.se.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class GuestController {
	private final GuestService guestService;
	private final ReviewService reviewService;
//	private final PagedResourcesAssembler<ReviewDetail> pagedResourcesAssembler;

	@GetMapping("/query_product_detail")
	public ResponseAPITemplate<ProductDetail> queryProductDetail(@RequestParam String productId) {
		// Xử lý dữ liệu productId ở đây
		var res = guestService.getProductDetail(productId);
		System.out.println("Product ID: " + productId);
		return ResponseAPITemplate.<ProductDetail>builder()
				.code(200)
				.message("Success")
				.result(res)
				.build();
	}

	@GetMapping("/address")
	public ResponseAPITemplate<List<UserDeliveryInfo>> queryProductList(@RequestParam String username) {
		List<UserDeliveryInfo> res = List.of(guestService.getUserDeliveryInfo(username));
		return ResponseAPITemplate.<List<UserDeliveryInfo>>builder()
				.code(200)
				.message("Success")
				.result(res)
				.build();
	}

	@GetMapping("/{productId}/reviews")
	public ResponseAPITemplate<Page<ReviewDetail>> queryProductReview(
			@PathVariable(value = "productId") String productId,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "10") int size) {
		Pageable pageable = Pageable.ofSize(size).withPage(page);
		Page<ReviewDetail> res = reviewService.getReviews(productId, pageable);
		return ResponseAPITemplate.<Page<ReviewDetail>>builder()
				.result(res)
				.build();
	}
}
