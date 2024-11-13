package com.se.backend.mapper;

import com.se.backend.dto.response.FlashProduct;
import com.se.backend.entity.Cart_ProductInstance;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;


public interface Cart_ProductInstanceMapper {
	Cart_ProductInstanceMapper INSTANCE = Mappers.getMapper(Cart_ProductInstanceMapper.class);

	Page<FlashProduct> toFlashProductPage(Page<Cart_ProductInstance> cartPage);

	FlashProduct toFlashProduct(Cart_ProductInstance cartProductInstance);
}
