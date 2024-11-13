package com.se.backend.mapper;

import com.se.backend.dto.response.FlashProduct;
import com.se.backend.entity.Cart;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CartMapper {
	CartMapper INSTANCE = Mappers.getMapper(CartMapper.class);

//	FlashProduct toFlashProduct(Cart cart);
}
