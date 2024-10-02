package com.se.backend.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.se.backend.dto.request.AuthenticationRequest;
import com.se.backend.dto.request.IntrospectRequest;
import com.se.backend.dto.request.LogoutRequest;
import com.se.backend.dto.request.RefreshRequest;
import com.se.backend.dto.response.AuthenticationResponse;
import com.se.backend.dto.response.IntrospectResponse;
import com.se.backend.entity.InvalidatedToken;
import com.se.backend.entity.User;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.repository.InvalidatedTokenRepository;
import com.se.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(makeFinal = true)
public class AuthenticationService {
	UserRepository userRepository;
	InvalidatedTokenRepository invalidatedTokenRepository;
	@NonFinal
	@Value("${jwt.signerKey}")
	protected String SIGNER_KEY;
	@NonFinal
	@Value("${jwt.valid-duration}")
	protected long VALID_DURATION;
	@NonFinal
	@Value("${jwt.refreshable-duration}")
	protected long REFRESHABLE_DURATION;

	public IntrospectResponse introspect(IntrospectRequest request) throws ParseException, JOSEException {
		var token = request.getToken();
		boolean isValid = true;
		try {
			verifyToken(token, false);
		} catch (WebServerException e) {
			isValid = false;
		}
		return IntrospectResponse.builder().valid(isValid).build();
	}

	public AuthenticationResponse authenticate(AuthenticationRequest request) {
		PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
		var user = userRepository.findByUsername(request.getUsername())
				.orElseThrow(() -> new WebServerException(ErrorCode.USER_NOT_FOUND));
		boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
		if (!authenticated) {
			throw new WebServerException(ErrorCode.UNAUTHENTICATED);
		}
		String token = generateToken(user);
		return AuthenticationResponse.builder().token(token).authenticatedToken(true).build();
	}

	public void logout(LogoutRequest request) throws ParseException, JOSEException {
		try {
			var signedJWT = verifyToken(request.getToken(), true);
			String jti = signedJWT.getJWTClaimsSet().getJWTID();
			Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
			// save invalidated token to db
			InvalidatedToken invalidatedToken = InvalidatedToken.builder()
					.id(jti)
					.expiryTime(expirationTime)
					.build();
			invalidatedTokenRepository.save(invalidatedToken);
		} catch (WebServerException e) {
			log.info("Token already invalidated");
		}
	}

	public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
		var signedJWT = verifyToken(request.getRefreshToken(), true);

		var jti = signedJWT.getJWTClaimsSet().getJWTID();
		Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();

		// save old token to invalidated token
		 InvalidatedToken invalidatedToken
		 	= InvalidatedToken.builder().id(jti).expiryTime(expirationTime).build();
		 invalidatedTokenRepository.save(invalidatedToken);

		var username = signedJWT.getJWTClaimsSet().getSubject();
		var user = userRepository.findByUsername(username)
				.orElseThrow(() -> new WebServerException(ErrorCode.UNAUTHENTICATED));
		var token = generateToken(user);
		return AuthenticationResponse.builder().token(token).authenticatedToken(true).build();
	}

	private String generateToken(User user) {
		JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.HS512).build();

		JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
				.subject(user.getUsername())
				.issuer("hcmut.se")
				.issueTime(new Date())
				.expirationTime(new Date(Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS)
						.toEpochMilli()))
				.jwtID((UUID.randomUUID()).toString())
				.claim("authorities", "USER")
				.build();

		Payload payload = new Payload(jwtClaimsSet.toJSONObject());
		JWSObject jwsObject = new JWSObject(header, payload);

		try {
			jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
			return jwsObject.serialize();
		} catch (JOSEException e) {
			log.error("Error signing token", e);
			throw new RuntimeException(e);
		}
	}

	private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
		JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
		SignedJWT signedJWT = SignedJWT.parse(token);
		Date expirationTime = (isRefresh)
				? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
				.toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
				: signedJWT.getJWTClaimsSet().getExpirationTime();

		var verified = signedJWT.verify(verifier);
		if (!verified && expirationTime.after(new Date())) {
			throw new WebServerException(ErrorCode.UNAUTHENTICATED);
		}
		// check if token is invalidated
		if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
			throw new WebServerException(ErrorCode.UNAUTHENTICATED);
		}
		return signedJWT;
	}

	private String buildScope(User user) {
		StringJoiner joiner = new StringJoiner(" ");
//		if(!CollectionUtils.isEmpty())
		return null;
	}
}
