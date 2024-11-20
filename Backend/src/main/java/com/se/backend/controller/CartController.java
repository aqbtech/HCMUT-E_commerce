package com.se.backend.controller;

import com.se.backend.dto.response.CartProduct;
import com.se.backend.dto.response.ResponseAPITemplate;
import com.se.backend.service.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class CartController {
	private final ICartService cartService;

	@GetMapping("/flash-cart")
	public ResponseAPITemplate<Page<CartProduct>>
	getFlashProductList(@AuthenticationPrincipal Jwt jwt,
						@RequestParam(value = "page", defaultValue = "0") int page,
						@RequestParam(value = "size", defaultValue = "10") int size) {
		String username = jwt.getSubject();
		Pageable pageable = PageRequest.of(page, size);
		Page<CartProduct> res = cartService.getFlashProductList(username, pageable);
		return ResponseAPITemplate.<Page<CartProduct>>builder()
				.result(res)
				.build();
	}
	@PostMapping("/add-to-cart")
	public ResponseAPITemplate<String> addProductInstanceToCart(@AuthenticationPrincipal Jwt jwt,
																@RequestParam(value = "productInstanceId") String productInstanceId,
																@RequestParam(value = "quantity") Long quantity) {
		String username = jwt.getSubject();
		cartService.addProductInsToCart(username, productInstanceId, quantity);
		return ResponseAPITemplate.<String>builder()
				.result(null)
				.build();
	}
	@PostMapping("/remove-from-cart")
	public ResponseAPITemplate<String> removeProductInstanceFromCart(@AuthenticationPrincipal Jwt jwt,
																	@RequestParam(value = "productInstanceId") String productInstanceId) {
		String username = jwt.getSubject();
		cartService.removeProductInsFromCart(username, productInstanceId);
		return ResponseAPITemplate.<String>builder()
				.result(null)
				.build();
	}
	@PostMapping("/update-cart")
	public ResponseAPITemplate<String> updateProductInstanceQuantity(@AuthenticationPrincipal Jwt jwt,
																	@RequestParam(value = "productInstanceId") String productInstanceId,
																	@RequestParam(value = "quantity") Long quantity) {
		String username = jwt.getSubject();
		cartService.updateProductInsQuantity(username, productInstanceId, quantity);
		return ResponseAPITemplate.<String>builder()
				.result(null)
				.build();
	}
	@PostMapping("/clear-cart")
	public ResponseAPITemplate<String> clearCart(@AuthenticationPrincipal Jwt jwt) {
		String username = jwt.getSubject();
		cartService.clearCart(username);
		return ResponseAPITemplate.<String>builder()
				.result(null)
				.build();
	}
}
