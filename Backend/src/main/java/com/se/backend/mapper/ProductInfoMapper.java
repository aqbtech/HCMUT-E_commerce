package com.se.backend.mapper;

import com.se.backend.dto.response.ProductDetail;
import com.se.backend.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductInfoMapper {
	@Mapping(target = "productId", source = "id")
	@Mapping(target = "name", source = "name")
	@Mapping(target = "description", source = "description")
	@Mapping(target = "totalQuantityInStock", ignore = true)
	@Mapping(target = "seller.sellerId", source = "seller.username")
	@Mapping(target = "seller.shopName", source = "seller.shopName")
	@Mapping(target = "seller.location", source = "seller.address.province")
	@Mapping(target = "attributes", ignore = true)
	@Mapping(target = "rating", ignore = true)
	@Mapping(target = "minPrice", ignore = true)
	@Mapping(target = "maxPrice", ignore = true)
	@Mapping(target = "instants", ignore = true)
	ProductDetail toProductDetail(Product product);

}
