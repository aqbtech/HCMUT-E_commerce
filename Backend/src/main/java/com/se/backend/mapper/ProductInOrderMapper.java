package com.se.backend.mapper;

import com.se.backend.dto.response.Product_of_GetOrderResponse;
import com.se.backend.entity.Product;
import com.se.backend.entity.ProductInstance;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductInOrderMapper {

    @Mapping(target = "productId", source = "id")
    @Mapping(target = "productName", ignore = true)
    @Mapping(target = "listAtt", ignore = true)
//    @Mapping(target = "IMG", ignore = true)
    @Mapping(target = "price", source = "price")
    @Mapping(target = "quantity", ignore = true)
    Product_of_GetOrderResponse toProductDetail(ProductInstance product);
}
