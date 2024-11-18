package com.se.backend.controller;

import com.se.backend.dto.response.CartProduct;
import com.se.backend.dto.response.ResponseAPITemplate;
import com.se.backend.service.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class CartController {
	private final ICartService cartService;

	@GetMapping("/flash-cart")
	public ResponseAPITemplate<Page<CartProduct>>
	getFlashProductList(@RequestParam(value = "username") String username,
						@RequestParam(value = "page", defaultValue = "0") int page,
						@RequestParam(value = "size", defaultValue = "10") int size) {
		Pageable pageable = PageRequest.of(page, size);
		Page<CartProduct> res = cartService.getFlashProductList(username, pageable);
		return ResponseAPITemplate.<Page<CartProduct>>builder()
				.result(res)
				.build();
	}
}
