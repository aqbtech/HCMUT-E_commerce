package com.se.backend.exception;

import com.se.backend.dto.response.ResponseAPITemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalHandler {
	private ResponseEntity<ResponseAPITemplate<String>> handleException(Exception e, HttpStatus status) {
		return ResponseEntity.status(status)
				.body(ResponseAPITemplate.<String>builder()
						.code(status.value())
						.message(e.getMessage())
						.result(null)
						.build());
	}
	@ExceptionHandler(WebServerException.class)
	public ResponseEntity<ResponseAPITemplate<String>> handleWebServerException(WebServerException e) {
		return handleException(e, HttpStatus.resolve(e.getErrorCode().getHttpStatusCode().value()));
	}
	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ResponseAPITemplate<String>> handleWebServerException(IllegalArgumentException e) {
		return handleException(e, HttpStatus.BAD_REQUEST);
	}
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ResponseAPITemplate<String>> handleAccessDeniedException(AccessDeniedException e) {
		return handleException(e, HttpStatus.FORBIDDEN);
	}
	@ExceptionHandler(AuthenticationServiceException.class)
	public ResponseEntity<ResponseAPITemplate<String>> handleAuthenticationServiceException(AuthenticationServiceException e) {
		return handleException(e, HttpStatus.UNAUTHORIZED);
	}
	// more exception handlers
}
