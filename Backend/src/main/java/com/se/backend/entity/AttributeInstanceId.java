package com.se.backend.entity;

import com.se.backend.constant.DBConstant;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AttributeInstanceId implements Serializable {
	private Long attributeId;
	@Column(name = "instance_id", length = 64)
	private String instanceId;

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		AttributeInstanceId that = (AttributeInstanceId) o;

		if (!attributeId.equals(that.attributeId)) return false;
		return instanceId.equals(that.instanceId);
	}
	@Override
	public int hashCode() {
		int result = attributeId.hashCode();
		result = 31 * result + instanceId.hashCode();
		return result;
	}
}
