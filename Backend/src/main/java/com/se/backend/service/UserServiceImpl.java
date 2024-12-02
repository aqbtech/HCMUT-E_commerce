package com.se.backend.service;

import com.se.backend.dto.response.MinimalUserProfile;
import com.se.backend.entity.Buyer;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.repository.BuyerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	private final BuyerRepository buyerRepository;

	@Override
	public MinimalUserProfile getMinimalProfile(String username) {
		Buyer buyer = buyerRepository.findMinimalByUsername(username)
				.orElseThrow(() -> new WebServerException(ErrorCode.USER_NOT_FOUND));
		return MinimalUserProfile.builder()
				.username(buyer.getUsername())
				.totalQuantityInCart(buyer.getCart().getTotalQuantity().intValue())
				.build();
	}
}
