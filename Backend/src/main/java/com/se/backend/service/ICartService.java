package com.se.backend.service;

import com.se.backend.dto.response.FlashProduct;
import org.springframework.data.domain.Page;

public interface ICartService {
	Page<FlashProduct> getFlashProductList(int page, int size);
	void addProductToCart(String username, String productId, int quantity);

	void removeProductFromCart(String username, String productId);

	void updateProductQuantity(String username, String productId, int quantity);

	void clearCart(String username);
}
