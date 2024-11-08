package com.se.backend.mapper;

import com.se.backend.dto.response.ProductDetail;
import com.se.backend.entity.Product;
import com.se.backend.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ProductDetailMapper {
	ProductDetailMapper INSTANCE = Mappers.getMapper(ProductDetailMapper.class);

	@Mapping(target = "productId", source = "id")
	@Mapping(target = "name", source = "name")
	@Mapping(target = "description", source = "description")
	@Mapping(target = "quantityInStock", source = "buildProduct.productInstance.quantityInStock")
	@Mapping(target = "seller.sellerId", source = "seller.username")
	@Mapping(target = "seller.shopName", source = "seller.shopName")
	@Mapping(target = "seller.location", source = "seller.address.province")
	@Mapping(target = "attributes", ignore = true)
	ProductDetail toProductDetail(Product product);

}
