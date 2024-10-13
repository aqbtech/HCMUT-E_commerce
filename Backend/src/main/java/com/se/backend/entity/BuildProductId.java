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
public class BuildProductId implements Serializable {
	private String productId;
	private AttributeInstanceId attributeInstanceId;
	private String productInstanceId;

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		BuildProductId that = (BuildProductId) o;

		if (!productId.equals(that.productId)) return false;
		if (!attributeInstanceId.equals(that.attributeInstanceId)) return false;
		return productInstanceId.equals(that.productInstanceId);
	}
	@Override
	public int hashCode() {
		int result = productId.hashCode();
		result = 31 * result + attributeInstanceId.hashCode();
		result = 31 * result + productInstanceId.hashCode();
		return result;
	}
}
