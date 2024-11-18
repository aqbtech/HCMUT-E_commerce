package com.se.backend.mapper;

import com.se.backend.dto.response.UserDeliveryInfo;
import com.se.backend.entity.DeliveryInfor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DeliveryMapper {
	@Mapping(target = "deliveryId", source = "id")
	@Mapping(target = "receiverName", source = "recipientName")
	@Mapping(target = "receiverPhone", source = "phoneNumber")
	@Mapping(target = "address", source = "address.specificAddress")
	@Mapping(target = "city", source = "address.province")
	@Mapping(target = "district", source = "address.district")
	@Mapping(target = "ward", source = "address.commune")
	UserDeliveryInfo toUserDeliveryInfo(DeliveryInfor deliveryInfor);

	List<UserDeliveryInfo> toUserDeliveryInfo(List<DeliveryInfor> deliveryInfos);
}
