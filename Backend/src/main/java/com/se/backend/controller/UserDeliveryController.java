package com.se.backend.controller;

import com.se.backend.dto.response.ResponseAPITemplate;
import com.se.backend.dto.response.UserDeliveryInfo;
import com.se.backend.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserDeliveryController {
	private final AddressService addressService;

	@GetMapping("/address")
	public ResponseAPITemplate<List<UserDeliveryInfo>> queryProductList(@AuthenticationPrincipal Jwt jwt) {
		String tokenUsername = jwt.getSubject();
		List<UserDeliveryInfo> res = addressService.getUserDeliveryInfo(tokenUsername);
		return ResponseAPITemplate.<List<UserDeliveryInfo>>builder()
				.result(res)
				.build();
	}
}
