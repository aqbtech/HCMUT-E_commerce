package com.se.backend.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Order_ProductInstanceId {
	private String orderId;
	private String productInstanceId;

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		Order_ProductInstanceId that = (Order_ProductInstanceId) o;

		if (!orderId.equals(that.orderId)) return false;
		return productInstanceId.equals(that.productInstanceId);
	}
	@Override
	public int hashCode() {
		int result = orderId.hashCode();
		result = 31 * result + productInstanceId.hashCode();
		return result;
	}
}
