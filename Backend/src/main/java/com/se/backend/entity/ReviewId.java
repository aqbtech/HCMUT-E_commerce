package com.se.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewId implements Serializable {
	private String productInstanceId;
	private String reviewContentId;
	private String buyerUsername;
	private Long paymentOrderId;

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		ReviewId that = (ReviewId) o;

		if (!productInstanceId.equals(that.productInstanceId)) return false;
		if (!reviewContentId.equals(that.reviewContentId)) return false;
		if (!buyerUsername.equals(that.buyerUsername)) return false;
		return paymentOrderId.equals(that.paymentOrderId);
	}
	@Override
	public int hashCode() {
		int result = productInstanceId.hashCode();
		result = 31 * result + reviewContentId.hashCode();
		result = 31 * result + buyerUsername.hashCode();
		result = 31 * result + paymentOrderId.hashCode();
		return result;
	}
}
