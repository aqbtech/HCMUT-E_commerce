package com.se.backend.service;

import com.se.backend.dto.request.AddAddressRequest;
import com.se.backend.dto.request.UpdateAddressRequest;
import com.se.backend.dto.response.UserDeliveryInfo;
import com.se.backend.entity.Address;
import com.se.backend.entity.Buyer;
import com.se.backend.entity.DeliveryInfor;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.mapper.DeliveryMapper;
import com.se.backend.repository.AddressRepository;
import com.se.backend.repository.BuyerRepository;
import com.se.backend.repository.DeliveryInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {
	private final DeliveryInfoRepository deliveryInfoRepository;
	private final DeliveryMapper deliveryMapper;
	private final BuyerRepository buyerRepository;
	private final AddressRepository addressRepository;
	@Override
	public List<UserDeliveryInfo> getUserDeliveryInfo(String username) {
		List<DeliveryInfor> deliveryInfor = deliveryInfoRepository.findByUserId(username)
										.orElseThrow(() -> new WebServerException(ErrorCode.DELIVERY_INFOR_NOT_EXIST));
		List<DeliveryInfor> response = deliveryInfor
				.stream()
				.filter(deliveryInfo -> !deliveryInfo.isDeleted()).toList();
		return deliveryMapper.toUserDeliveryInfo(response);
	}

	@Override
	public String addAddress(String username, AddAddressRequest addressRequest){
		Buyer buyer = buyerRepository.findByUsername(username)
				.orElseThrow(()->new WebServerException(ErrorCode.USER_NOT_FOUND));
		Address address = Address.builder()
				.specificAddress(addressRequest.getDetailAddress())
				.commune(addressRequest.getWard())
				.district(addressRequest.getDistrict())
				.province(addressRequest.getProvince())
				.build();
		try{
			addressRepository.save(address);
		}catch (WebServerException e){
			throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
		}
		DeliveryInfor deliveryInfor = DeliveryInfor.builder()
				.buyer(buyer)
				.address(address)
				.phoneNumber(addressRequest.getPhone())
				.recipientName(addressRequest.getName())
				.build();
		try{
			deliveryInfoRepository.save(deliveryInfor);
		}catch (WebServerException e){
			throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
		}
        return "Add address successfully";
    }
	@Override
	public String updateAddress(String username, UpdateAddressRequest updateAddressRequest) {
		Buyer buyer = buyerRepository.findByUsername(username)
				.orElseThrow(() -> new WebServerException(ErrorCode.USER_NOT_FOUND));
		DeliveryInfor deliveryInfor = deliveryInfoRepository.findById(updateAddressRequest.getId())
				.orElseThrow(() -> new WebServerException(ErrorCode.ADDRESS_NOT_FOUND));
		Address address = deliveryInfor.getAddress();
		if (updateAddressRequest.getDetailAddress() != null) {
			address.setSpecificAddress(updateAddressRequest.getDetailAddress());
		}
		if (updateAddressRequest.getWard() != null) {
			address.setCommune(updateAddressRequest.getWard());
		}
		if (updateAddressRequest.getDistrict() != null) {
			address.setDistrict(updateAddressRequest.getDistrict());
		}
		if (updateAddressRequest.getProvince() != null) {
			address.setProvince(updateAddressRequest.getProvince());
		}
		try {
			addressRepository.save(address);
		} catch (Exception e) {
			throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
		}
		if (updateAddressRequest.getPhone() != null) {
			deliveryInfor.setPhoneNumber(updateAddressRequest.getPhone());
		}
		if (updateAddressRequest.getName() != null) {
			deliveryInfor.setRecipientName(updateAddressRequest.getName());
		}
		try {
			deliveryInfoRepository.save(deliveryInfor);
		} catch (Exception e) {
			throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
		}
		return "Update address successfully";
	}

	@Override
	public String deleteAddress(String username, Long addressId){
		Buyer buyer = buyerRepository.findByUsername(username)
				.orElseThrow(() -> new WebServerException(ErrorCode.USER_NOT_FOUND));
		DeliveryInfor deliveryInfor = deliveryInfoRepository.findById(addressId)
				.orElseThrow(() -> new WebServerException(ErrorCode.ADDRESS_NOT_FOUND));
		try{
			deliveryInfor.setDeleted(Boolean.TRUE);
			deliveryInfoRepository.save(deliveryInfor);
		}
		catch (WebServerException e){
			throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
		}
		return "Delete sucessfully";
	}
}
