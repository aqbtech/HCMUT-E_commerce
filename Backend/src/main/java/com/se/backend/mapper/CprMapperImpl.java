package com.se.backend.mapper;

import com.se.backend.dto.response.FlashProduct;
import com.se.backend.entity.Cart_ProductInstance;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class CprMapperImpl implements Cart_ProductInstanceMapper {
	@Override
	public Page<FlashProduct> toFlashProductPage(Page<Cart_ProductInstance> cartPage) {
		return null;
	}

	@Override
	public FlashProduct toFlashProduct(Cart_ProductInstance cartProductInstance) {
		return null;
	}
}
