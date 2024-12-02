package com.se.backend.mapper;

import com.se.backend.dto.response.ShopInformationResponse;
import com.se.backend.entity.Seller;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SellerMapper {
    @Mapping(target = "shopName", source = "shopName")
//    @Mapping(target = "description", ignore = true)
//    @Mapping(target = "address", ignore = true)
    ShopInformationResponse toShopInformation(Seller seller);
}
