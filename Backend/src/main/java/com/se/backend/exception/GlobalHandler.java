package com.se.backend.exception;

import com.se.backend.dto.response.ResponseAPITemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalHandler {
	@ExceptionHandler(WebServerException.class)
	public ResponseEntity<String> handleWebServerException(WebServerException e) {
		return ResponseEntity.status(e.getErrorCode().getHttpStatusCode()).body(e.getMessage());
	}
	// more exception handlers
}
