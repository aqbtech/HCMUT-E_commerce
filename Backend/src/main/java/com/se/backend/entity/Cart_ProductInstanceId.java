package com.se.backend.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Cart_ProductInstanceId {
	private String productInstanceId;
	private BuyerCartId buyerCartId;

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		Cart_ProductInstanceId that = (Cart_ProductInstanceId) o;

		if (!productInstanceId.equals(that.productInstanceId)) return false;
		return buyerCartId.equals(that.buyerCartId);
	}
	@Override
	public int hashCode() {
		int result = productInstanceId.hashCode();
		result = 31 * result + buyerCartId.hashCode();
		return result;
	}
}
