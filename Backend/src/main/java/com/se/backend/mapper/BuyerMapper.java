package com.se.backend.mapper;

import com.se.backend.dto.response.BuyerInformationResopnse;
import com.se.backend.entity.Buyer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BuyerMapper {
    @Mapping(target = "firstName", source = "firstName")
    @Mapping(target = "lastName", source = "lastName")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "phone", source = "phone")
    @Mapping(target = "DOB", source = "dob")
    BuyerInformationResopnse toBuyerInformationResponse(Buyer buyer);
}
