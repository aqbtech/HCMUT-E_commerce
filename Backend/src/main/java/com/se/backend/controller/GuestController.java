package com.se.backend.controller;

import com.se.backend.dto.response.ProductDetail;
import com.se.backend.dto.response.ResponseAPITemplate;
import com.se.backend.service.GuestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class GuestController {
	private final GuestService guestService;
	@GetMapping("/query_product_detail")
	public ResponseAPITemplate<ProductDetail> queryProductDetail(@RequestParam String productId) {
		// Xử lý dữ liệu productId ở đây
		guestService.getProductDetail(productId);
		System.out.println("Product ID: " + productId);
		return ResponseAPITemplate.<ProductDetail>builder()
				.code(200)
				.message("Success")
				.build();
	}
}
