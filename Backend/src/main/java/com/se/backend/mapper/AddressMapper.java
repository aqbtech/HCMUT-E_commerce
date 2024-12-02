package com.se.backend.mapper;

import com.se.backend.dto.response.ShopAddressResponse;
import com.se.backend.entity.Address;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    @Mapping(target = "province", source = "province")
    @Mapping(target = "district", source = "district")
    @Mapping(target = "commune", source = "commune")
    @Mapping(target = "specific_address", source = "specificAddress")
    ShopAddressResponse toShopAddressResponse(Address address);
}
