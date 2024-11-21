package com.se.backend.exception;

import com.se.backend.dto.response.ResponseAPITemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalHandler {
	@ExceptionHandler(WebServerException.class)
	public ResponseEntity<ResponseAPITemplate<String>> handleWebServerException(WebServerException e) {
		ResponseEntity<ResponseAPITemplate<String>> res = ResponseEntity.status(e.getErrorCode().getHttpStatusCode())
				.body(ResponseAPITemplate.<String>builder()
						.code(e.getErrorCode().getCode())
						.message(e.getMessage())
						.result(null)
						.build());
		return res;
	}
	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ResponseAPITemplate<String>> handleWebServerException(IllegalArgumentException e) {
		ResponseEntity<ResponseAPITemplate<String>> res = ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(ResponseAPITemplate.<String>builder()
						.code(400)
						.message(e.getMessage())
						.result(null)
						.build());
		return res;
	}
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ResponseAPITemplate<String>> handleAccessDeniedException(AccessDeniedException e) {
		ResponseEntity<ResponseAPITemplate<String>> res = ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(ResponseAPITemplate.<String>builder()
						.code(403)
						.message(e.getMessage())
						.result(null)
						.build());
		return res;
	}
	// more exception handlers
}
