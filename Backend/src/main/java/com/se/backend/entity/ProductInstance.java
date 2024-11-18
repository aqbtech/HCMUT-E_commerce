package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@NamedEntityGraph(name = "product-instance-detail", attributeNodes = {
		@NamedAttributeNode(value = "buildProduct", subgraph = "buildProduct-attributeInstance")},
		subgraphs = {
				@NamedSubgraph(
						name = "buildProduct-attributeInstance",
						attributeNodes = @NamedAttributeNode("attributeInstance"))
		}
)
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "product_instance")
public class ProductInstance {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "root_product_instance_id", length = 64)
	private String id;
	private Double price;
	private Long quantityInStock;

	// -- mapping relationships --
	// mapping order_product-instances
	@OneToMany(mappedBy = "productInstance")
	private List<Order_ProductInstance> order_productInstances;
	// mapping 3-ary relationship build product
	@OneToMany(mappedBy = "productInstance")
	private List<BuildProduct> buildProduct;
	// mapping reviews
	@OneToMany(mappedBy = "productInstance")
	private List<Review> review;
	// mapping cart, many-to-many relationship
	@OneToMany(mappedBy = "productInstance")
	private List<Cart_ProductInstance> cartProductInstances;
}
