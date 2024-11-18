package com.se.backend.exception;

import com.se.backend.dto.response.ResponseAPITemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalHandler {
	@ExceptionHandler(WebServerException.class)
	public ResponseAPITemplate<String> handleWebServerException(WebServerException e) {
		return ResponseAPITemplate.<String>builder()
				.code(e.getErrorCode().getCode())
				.message(e.getMessage())
				.result(null)
				.build();
	}
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseAPITemplate<String> handleAccessDeniedException(AccessDeniedException e) {
		return ResponseAPITemplate.<String>builder()
				.code(403)
				.message(e.getMessage())
				.result(null)
				.build();
	}
	// more exception handlers
}
