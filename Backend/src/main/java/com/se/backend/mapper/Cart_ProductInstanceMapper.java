package com.se.backend.mapper;

import com.se.backend.dto.response.CartProduct;
import com.se.backend.entity.Cart_ProductInstance;

import java.util.List;


public interface Cart_ProductInstanceMapper {
	List<CartProduct> toFlashProductList(List<Cart_ProductInstance> cartPage);

	CartProduct toCartProduct(Cart_ProductInstance cartProductInstance);
}
