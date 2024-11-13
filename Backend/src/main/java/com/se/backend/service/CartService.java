package com.se.backend.service;

import com.se.backend.dto.response.FlashProduct;
import com.se.backend.entity.Cart;
import com.se.backend.entity.Cart_ProductInstance;
import com.se.backend.mapper.Cart_ProductInstanceMapper;
import com.se.backend.repository.CartRepository;
import com.se.backend.repository.Cart_ProductInstanceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class CartService implements ICartService {
	private final CartRepository cartRepository;
	private final Cart_ProductInstanceMapper cartProductInstanceMapper;
	private final Cart_ProductInstanceRepository cpr;

	@Override
	public Page<FlashProduct> getFlashProductList(String username, Pageable pageable) {
		Cart cart = cartRepository.findByBuyerUsername(username);
		Page<Cart_ProductInstance> cartProductInstances = cpr.findByCart(cart, pageable);
		Page<FlashProduct> res = cartProductInstanceMapper.toFlashProductPage(cartProductInstances);
		// mapping image url

		// mapping listName

		// mapping listValue

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
