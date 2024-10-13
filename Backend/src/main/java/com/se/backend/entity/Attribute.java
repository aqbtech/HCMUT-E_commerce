package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "attribute")
public class Attribute {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "root_attribute_id", length = 64)
	private Long id;
	private String name;

	// -- relationship mappings --
	// weak entity mapping
	@OneToMany(mappedBy = "attribute", cascade = CascadeType.ALL)
	private List<AttributeInstance> attributeInstances = new ArrayList<>();
	// product mapping
	@ManyToOne(optional = false)
	@JoinColumn(name = "product_id", referencedColumnName = "root_product_id")
	private Product ofProduct;
}
