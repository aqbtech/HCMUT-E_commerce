package com.se.backend.controller;

import com.se.backend.dto.request.AddAddressRequest;
import com.se.backend.dto.request.UpdateAddressRequest;
import com.se.backend.dto.response.ResponseAPITemplate;
import com.se.backend.dto.response.UserDeliveryInfo;
import com.se.backend.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

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

	@PostMapping("/address")
	public ResponseAPITemplate<String> addAdrdess(
			@AuthenticationPrincipal Jwt jwt,
			@RequestBody AddAddressRequest request) {
		String res = addressService.addAddress(jwt.getSubject(), request);
		return ResponseAPITemplate.<String>builder()
				.result(res)
				.build();
	}
	@PutMapping("/update_address")
	public ResponseAPITemplate<String> addAdrdess(
			@AuthenticationPrincipal Jwt jwt,
			@RequestBody UpdateAddressRequest request) {
		String res = addressService.updateAddress(jwt.getSubject(), request);
		return ResponseAPITemplate.<String>builder()
				.result(res)
				.build();
	}
	@DeleteMapping("/delete_address")
	public ResponseAPITemplate<String> updateAdrdess(
			@AuthenticationPrincipal Jwt jwt,
			@RequestParam("addressId") Long addressId) {
		String res = addressService.deleteAddress(jwt.getSubject(), addressId);
		return ResponseAPITemplate.<String>builder()
				.result(res)
				.build();
	}
}
