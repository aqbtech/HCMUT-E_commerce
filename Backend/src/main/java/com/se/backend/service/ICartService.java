package com.se.backend.service;

import com.se.backend.dto.response.FlashProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ICartService {
	Page<FlashProduct> getFlashProductList(String username, Pageable pageable);
	void addProductToCart(String username, String productId, int quantity);

	void removeProductFromCart(String username, String productId);

	void updateProductQuantity(String username, String productId, int quantity);

	void clearCart(String username);
}
