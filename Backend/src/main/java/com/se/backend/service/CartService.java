package com.se.backend.service;

import com.se.backend.dto.response.FlashProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CartService implements ICartService {
	@Override
	public Page<FlashProduct> getFlashProductList(String username, Pageable pageable) {

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
