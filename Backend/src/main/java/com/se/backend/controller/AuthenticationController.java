package com.se.backend.controller;

import com.nimbusds.jose.JOSEException;
import com.se.backend.dto.request.AuthenticationRequest;
import com.se.backend.dto.request.IntrospectRequest;
import com.se.backend.dto.request.LogoutRequest;
import com.se.backend.dto.request.RefreshRequest;
import com.se.backend.dto.response.AuthenticationResponse;
import com.se.backend.dto.response.IntrospectResponse;
import com.se.backend.dto.response.ResponseAPITemplate;
import com.se.backend.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true)
public class AuthenticationController {
	// This class is used to handle all authentication requests

	private AuthenticationService authService;

	@PostMapping("/token")
	public ResponseAPITemplate<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest authReq) {
		var authResponse = authService.authenticate(authReq);
		return ResponseAPITemplate.<AuthenticationResponse>builder()
				.result(authResponse)
				.build();
	}

	@PostMapping("introspect")
	ResponseAPITemplate<IntrospectResponse> introspect(@RequestBody IntrospectRequest request)
			throws ParseException, JOSEException {
		var introspectResponse = authService.introspect(request);
		return ResponseAPITemplate.<IntrospectResponse>builder()
				.result(introspectResponse)
				.build();
	}

	@PostMapping("/refresh")
	ResponseAPITemplate<AuthenticationResponse> refreshToken(@RequestBody RefreshRequest refreshReq)
			throws ParseException, JOSEException {
		var authResponse = authService.refreshToken(refreshReq);
		return ResponseAPITemplate.<AuthenticationResponse>builder()
				.result(authResponse)
				.build();
	}

	@PostMapping("/logout")
	ResponseAPITemplate<Void> logout(@RequestBody LogoutRequest request)
			throws ParseException, JOSEException {
		authService.logout(request);
		return ResponseAPITemplate.<Void>builder()
				.build();
	}
}
