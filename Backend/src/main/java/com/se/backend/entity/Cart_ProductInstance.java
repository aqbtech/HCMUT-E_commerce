package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NamedEntityGraph(name = "cart-product-instance-detail", attributeNodes = {
		@NamedAttributeNode(value = "productInstance", subgraph = "productInstance-subgraph")
}, subgraphs = {@NamedSubgraph(name = "productInstance-subgraph", attributeNodes = {
		@NamedAttributeNode(value = "buildProduct", subgraph = "buildProduct-subgraph")
		}),
		@NamedSubgraph(name = "buildProduct-subgraph", attributeNodes = {
				@NamedAttributeNode(value = "product")
		})
})
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "cart_product_instance")
public class Cart_ProductInstance {
	@EmbeddedId
	private Cart_ProductInstanceId cart_productInstanceId;
	private Long quantity;

	// -- mapping relationships --
	// mapping cart
	@ManyToOne
	@MapsId("buyerCartId")
	@JoinColumns({
			@JoinColumn(name = "buyer_cart_id", referencedColumnName = "composite_cart_id"),
			@JoinColumn(name = "buyer_id", referencedColumnName = "username")
	})
	private Cart cart;
	// mapping product instance
	@ManyToOne
	@MapsId("productInstanceId")
	@JoinColumn(name = "product_instance_id", referencedColumnName = "root_product_instance_id")
	private ProductInstance productInstance;
}
