package com.se.backend.dto.response;


import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MinimalUserProfile {
	private String username;
	private String role;
	private int totalQuantityInCart;
}
