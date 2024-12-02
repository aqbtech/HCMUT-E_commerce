package com.se.backend.controller;

import com.se.backend.dto.response.MinimalUserProfile;
import com.se.backend.dto.response.ResponseAPITemplate;
import com.se.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {
	private final UserService userService;

	@GetMapping("/minimal-profile")
	public ResponseAPITemplate<MinimalUserProfile> getMinimalProfile(@AuthenticationPrincipal Jwt jwt) {
		MinimalUserProfile minimalUserProfile = userService.getMinimalProfile(jwt.getSubject());
		minimalUserProfile.setRole(jwt.getClaim("authorities"));
		return ResponseAPITemplate.<MinimalUserProfile>builder()
				.result(minimalUserProfile)
				.build();
	}
}
