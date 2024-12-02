package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@NamedEntityGraph(name = "cart-detail", attributeNodes = {
		@NamedAttributeNode(value = "cartProductInstances", subgraph = "cartProductInstances-subgraph"),
		@NamedAttributeNode(value = "buyer")
}, subgraphs = {
		@NamedSubgraph(name = "cartProductInstances-subgraph", attributeNodes = {
				@NamedAttributeNode(value = "productInstance")
		})
})
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "cart")
public class Cart {
	@EmbeddedId
	private BuyerCartId cartId;
	private Double totalPrice;
	private Long totalQuantity;

	// -- mapping relationships --
	// mapping buyer identity relationship
	@OneToOne
	@MapsId("username")
	@JoinColumn(name = "username", referencedColumnName = "username", nullable = false)
	private Buyer buyer;
	// mapping cart_product_instance, many-to-many relationship
	@OneToMany(mappedBy = "cart")
	private List<Cart_ProductInstance> cartProductInstances;
}
