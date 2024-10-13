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
@Table(name = "product")
public class Product {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "root_product_id", length = 64)
	private String id;
	private String name;
	private String description;

	// -- mapping relationships --
	// mapping category
	@ManyToOne(optional = false)
	@JoinColumn(name = "category_name", referencedColumnName = "name")
	private Category category;

	// mapping attribute
	@OneToMany(mappedBy = "ofProduct")
	private List<Attribute> attributes;

	// mapping 3-ary relationship build product
	@OneToOne(mappedBy = "product")
	private BuildProduct buildProduct;
	// mapping seller
	@ManyToOne(optional = false)
	@JoinColumn(name = "seller_id", referencedColumnName = "username")
	private Seller seller;
	// mapping admin
	@ManyToMany
	@JoinTable(name = "admin_product",
			joinColumns = @JoinColumn(name = "product_id", referencedColumnName = "root_product_id"),
			inverseJoinColumns = @JoinColumn(name = "admin_id", referencedColumnName = "username"))
	private List<Admin> admins;
}
