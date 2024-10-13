package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "build_product")
public class BuildProduct {
	@EmbeddedId
	private BuildProductId id;

	// -- mapping relationships --
	// mapping attribute instance
	@ManyToOne
	@MapsId("attributeInstanceId")
	@JoinColumns({
			@JoinColumn(name = "attribute_instance_id", referencedColumnName = "instance_id"),
			@JoinColumn(name = "attribute_id", referencedColumnName = "attribute_id")
	})
	private AttributeInstance attributeInstance;
	// mapping product
	@OneToOne
	@MapsId("productId")
	@JoinColumn(name = "product_id_r", referencedColumnName = "root_product_id"
			, columnDefinition = "VARCHAR(64)")
	private Product product;
	// mapping product instance
	@OneToOne
	@MapsId("productInstanceId")
	@JoinColumn(name = "product_instance_id", referencedColumnName = "root_product_instance_id"
			, columnDefinition = "VARCHAR(64)")
	private ProductInstance productInstance;
}