package com.se.backend.mapper;

import com.se.backend.dto.response.DeliveryAddress_of_GetOrderResponse;
import com.se.backend.entity.DeliveryInfor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DeliveryInforInOrderMapper {
    @Mapping(target = "name", source = "recipientName")
    @Mapping(target = "phone", source = "phoneNumber")
    @Mapping(target = "province", source = "address.province")
    @Mapping(target = "state", ignore = true)
    @Mapping(target = "Detail", source = "address.specificAddress")
    DeliveryAddress_of_GetOrderResponse toDeliveryInforInOrder(DeliveryInfor deliveryInfor);
}
