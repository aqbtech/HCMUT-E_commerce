package com.se.backend.service;

import com.se.backend.dto.response.CartProduct;
import com.se.backend.entity.*;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.mapper.Cart_ProductInstanceMapper;
import com.se.backend.repository.CartRepository;
import com.se.backend.repository.Cart_ProductInstanceRepository;
import com.se.backend.repository.ProductInstanceRepository;
import com.se.backend.utils.PaginationUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class CartService implements ICartService {
	private final CartRepository cartRepository;
	private final Cart_ProductInstanceMapper cartProductInstanceMapper;
	private final Cart_ProductInstanceRepository cpr;
	private final ProductInstanceRepository pir;

	@Override
	public Page<CartProduct> getFlashProductList(String username, Pageable pageable) {
		Optional<Cart> cart = cartRepository.findByBuyerUsername(username);
		if (cart.isEmpty()) {
			return PaginationUtils.convertListToPage(List.of(), pageable);
		}
		List<Cart_ProductInstance> cartProductInstances = cpr.findByCart(cart.get());
		return PaginationUtils.convertListToPage(cartProductInstanceMapper.toFlashProductList(cartProductInstances), pageable);
	}

	@Override
	public void addProductInsToCart(String username, String productInsId, Long quantity) {
		Cart cart = cartRepository.findByBuyerUsername(username)
				.orElseThrow(() -> new WebServerException(ErrorCode.CART_NOT_FOUND));
		ProductInstance productIns = pir.findById(productInsId)
				.orElseThrow(() -> new WebServerException(ErrorCode.PRODUCT_NOT_FOUND));
		// check if product is already in cart then update quantity
		// else add new product to cart
		Optional<Cart_ProductInstance> cartProductInstance = cpr.findByCartAndProductInstance(cart, productIns);
		Cart_ProductInstance cpi;
		if (cartProductInstance.isPresent()) {
			cpi = cartProductInstance.get();
			// pre-check quantity
			if (cpi.getQuantity() + quantity > productIns.getQuantityInStock()) {
				throw new WebServerException(ErrorCode.INSUFFICIENT_STOCK);
			}
			cpi.setQuantity(cpi.getQuantity() + quantity);
		} else {
			cpi = new Cart_ProductInstance();
			// set id for cart
			Cart_ProductInstanceId id = new Cart_ProductInstanceId();
			id.setBuyerCartId(new BuyerCartId(username, cart.getCartId().getCartId()));
			id.setProductInstanceId(productInsId);
			cpi.setCart_productInstanceId(id);
			cpi.setCart(cart);
			cpi.setProductInstance(productIns);
			// pre-check quantity
			if (quantity > productIns.getQuantityInStock()) {
				throw new WebServerException(ErrorCode.INSUFFICIENT_STOCK);
			}
			cpi.setQuantity(quantity);
		}
		cpr.save(cpi);
		// update cart
		cart.setTotalPrice(cart.getTotalPrice() + productIns.getPrice() * quantity);
		cart.setTotalQuantity(cart.getTotalQuantity() + quantity);
		cartRepository.save(cart);
	}

	@Override
	@Transactional
	public void removeProductInsFromCart(String username, String productInsId) {
		Cart cart = cartRepository.findByBuyerUsername(username)
				.orElseThrow(() -> new WebServerException(ErrorCode.CART_NOT_FOUND));
		ProductInstance productIns = pir.findById(productInsId)
				.orElseThrow(() -> new WebServerException(ErrorCode.PRODUCT_NOT_FOUND));
		Cart_ProductInstance cpi = cpr.findByCartAndProductInstance(cart, productIns)
				.orElseThrow(() -> new WebServerException(ErrorCode.PRODUCT_NOT_FOUND));
		cart.setTotalPrice(cart.getTotalPrice() - cpi.getProductInstance().getPrice() * cpi.getQuantity());
		cart.setTotalQuantity(cart.getTotalQuantity() - cpi.getQuantity());
		cpr.delete(cpi);
		cartRepository.save(cart);
	}

	@Override
	@Transactional
	public void updateProductInsQuantity(String username, String productInsId, Long quantity) {
		Cart cart = cartRepository.findByBuyerUsername(username)
				.orElseThrow(() -> new WebServerException(ErrorCode.CART_NOT_FOUND));
		ProductInstance productIns = pir.findById(productInsId)
				.orElseThrow(() -> new WebServerException(ErrorCode.PRODUCT_NOT_FOUND));
		Cart_ProductInstance cpi = cpr.findByCartAndProductInstance(cart, productIns)
				.orElseThrow(() -> new WebServerException(ErrorCode.CART_PRODUCT_NOT_FOUND));
		// pre-check quantity
		if (quantity < 0 || quantity > productIns.getQuantityInStock()) {
			throw new WebServerException(ErrorCode.INSUFFICIENT_STOCK);
		}
		if (quantity == 0 ) {
			cart.setTotalPrice(cart.getTotalPrice() - cpi.getProductInstance().getPrice() * cpi.getQuantity());
			cart.setTotalQuantity(cart.getTotalQuantity() - cpi.getQuantity());
			cpr.delete(cpi);
		} else {
			long residualQuantity = quantity - cpi.getQuantity();
			cart.setTotalQuantity(cart.getTotalQuantity() + residualQuantity);
			cart.setTotalPrice(cart.getTotalPrice() + residualQuantity * productIns.getPrice());
			cpi.setQuantity(quantity);
			cpr.save(cpi);
		}
		cartRepository.save(cart);
	}

	@Override
	@Transactional
	public void clearCart(String username) {
		Cart cart = cartRepository.findByBuyerUsername(username)
				.orElseThrow(() -> new WebServerException(ErrorCode.CART_NOT_FOUND));
		cpr.deleteAll(cart.getCartProductInstances());
		cart.setTotalPrice(0.0);
		cart.setTotalQuantity(0L);
		cartRepository.save(cart);
	}

}
