package com.se.backend.service;

import com.se.backend.dto.response.FlashProduct;
import org.springframework.data.domain.Page;

public class CartService implements ICartService {
	@Override
	public Page<FlashProduct> getFlashProductList(int page, int size) {
		return null;
	}

	@Override
	public void addProductToCart(String username, String productId, int quantity) {

	}

	@Override
	public void removeProductFromCart(String username, String productId) {

	}

	@Override
	public void updateProductQuantity(String username, String productId, int quantity) {

	}

	@Override
	public void clearCart(String username) {

	}

}
