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
@Table(name = "product_instance")
public class ProductInstance {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "root_product_instance_id", length = 64)
	private String id;
	private Long price;
	private Long quantityInStock;

	// -- mapping relationships --
	// mapping order_product-instances
	@OneToMany(mappedBy = "productInstance")
	private List<Order_ProductInstance> order_productInstances;
	// mapping 3-ary relationship build product
	@OneToMany(mappedBy = "productInstance")
	private List<BuildProduct> buildProduct;
	// mapping reviews
	@OneToOne(mappedBy = "productInstance")
	private Review review;
	// mapping cart, many-to-many relationship
	@OneToMany(mappedBy = "productInstance")
	private List<Cart_ProductInstance> cartProductInstances;
}
