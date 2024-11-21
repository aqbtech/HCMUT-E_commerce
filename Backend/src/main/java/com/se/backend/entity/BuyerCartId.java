package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BuyerCartId implements Serializable {
	private String username;
	@Column(name = "composite_cart_id")
	private String cartId;

	public BuyerCartId(String username) {
		this.username = username;
		this.cartId = username;
	}
	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		BuyerCartId that = (BuyerCartId) o;

		if (!username.equals(that.username)) return false;
		return cartId.equals(that.cartId);
	}
	@Override
	public int hashCode() {
		int result = username.hashCode();
		result = 31 * result + cartId.hashCode();
		return result;
	}
}
