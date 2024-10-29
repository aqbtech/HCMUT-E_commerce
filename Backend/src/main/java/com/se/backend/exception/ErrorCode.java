package com.se.backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
	UNKNOWN_ERROR(5000, "Unknown error", HttpStatus.INTERNAL_SERVER_ERROR),
	INVALID_KEY(1000, "Invalid key", HttpStatus.BAD_REQUEST),
	UNAUTHENTICATED(1001, "Unauthenticated", HttpStatus.UNAUTHORIZED),
	UNAUTHORIZED(1002, "You do not have permission", HttpStatus.FORBIDDEN),
	USER_NOT_FOUND(1003, "User not found", HttpStatus.NOT_FOUND),
	PRODUCT_NOT_FOUND(1004, "Product not found", HttpStatus.NOT_FOUND),
	PRODUCT_NOT_BELONG_TO_SELLER(1005, "Product not belong to seller", HttpStatus.NOT_FOUND),
	CATEGORY_NOT_FOUND(1006, "Category not found", HttpStatus.NOT_FOUND),
	;
	private final int code;
	private final String message;
	private final HttpStatusCode httpStatusCode;

	ErrorCode(int code, String message, HttpStatusCode httpStatusCode) {
		this.code = code;
		this.message = message;
		this.httpStatusCode = httpStatusCode;
	}

}
