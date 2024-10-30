package com.se.backend.service;

import com.nimbusds.jose.JOSEException;
import com.se.backend.dto.request.AuthenticationRequest;
import com.se.backend.dto.request.IntrospectRequest;
import com.se.backend.dto.request.LogoutRequest;
import com.se.backend.dto.request.RefreshRequest;
import com.se.backend.dto.response.AuthenticationResponse;
import com.se.backend.dto.response.IntrospectResponse;

import java.text.ParseException;

public interface AuthenticationProvider {
	IntrospectResponse introspect(IntrospectRequest request) throws ParseException, JOSEException;
	AuthenticationResponse authenticate(AuthenticationRequest request);
	void logout(LogoutRequest request) throws ParseException, JOSEException;
	AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException;
}
