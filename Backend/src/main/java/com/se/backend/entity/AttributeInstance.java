package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "attribute_instance")
public class AttributeInstance {
	@EmbeddedId
	private AttributeInstanceId attributeInstanceId;
	private String value;

	// -- relationship mapping --
	// attribute mapping
	@ManyToOne
	@MapsId("attributeId")
	@JoinColumn(name = "attribute_id", referencedColumnName = "root_attribute_id")
	private Attribute attribute;

	// 3-ary relationship mapping
	@OneToMany(mappedBy = "attributeInstance", cascade = CascadeType.ALL)
	private List<BuildProduct> buildProducts;
}
