package com.se.backend.service;

import com.se.backend.dto.response.CartProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ICartService {
	Page<CartProduct> getFlashProductList(String username, Pageable pageable);
	void addProductInsToCart(String username, String productInsId, Long quantity);

	void removeProductInsFromCart(String username, String productInsId);

	void updateProductInsQuantity(String username, String productInsId, Long quantity);

	void clearCart(String username);
}
