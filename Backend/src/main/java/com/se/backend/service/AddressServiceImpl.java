package com.se.backend.service;

import com.se.backend.dto.response.UserDeliveryInfo;
import com.se.backend.entity.DeliveryInfor;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.mapper.DeliveryMapper;
import com.se.backend.repository.DeliveryInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {
	private final DeliveryInfoRepository deliveryInfoRepository;
	private final DeliveryMapper deliveryMapper;
	@Override
	public List<UserDeliveryInfo> getUserDeliveryInfo(String username) {
		List<DeliveryInfor> deliveryInfor = deliveryInfoRepository.findByUserId(username)
										.orElseThrow(() -> new WebServerException(ErrorCode.DELIVERY_INFOR_NOT_EXIST));
		return deliveryMapper.toUserDeliveryInfo(deliveryInfor);
	}

}
