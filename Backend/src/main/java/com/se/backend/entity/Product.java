package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@NamedEntityGraphs({
		@NamedEntityGraph(name = "product-detail", attributeNodes = {
				@NamedAttributeNode(value = "buildProduct", subgraph = "buildProduct-productInstance"),
				@NamedAttributeNode("productImgs"),
				@NamedAttributeNode("seller")},
				subgraphs = {
						@NamedSubgraph(
								name = "buildProduct-productInstance",
								attributeNodes = @NamedAttributeNode("productInstance"))
				}
		),
		@NamedEntityGraph(name = "product-summary", attributeNodes = {
				@NamedAttributeNode("id"),
				@NamedAttributeNode("name"),
				@NamedAttributeNode("description"),
				@NamedAttributeNode("category"),
				@NamedAttributeNode("productImgs"),
				@NamedAttributeNode(value = "seller", subgraph = "location")
			},
				subgraphs = {
				@NamedSubgraph(
						name = "location",
						attributeNodes = @NamedAttributeNode("address"))
		}
		),
		@NamedEntityGraph(name = "product-attribute", attributeNodes = {
				@NamedAttributeNode("attributes"),
				@NamedAttributeNode("seller")
		}),
		@NamedEntityGraph(
				name = "product",
				attributeNodes = {
						@NamedAttributeNode("name"),
						@NamedAttributeNode("description"),
						@NamedAttributeNode("category"),
//						@NamedAttributeNode("attributes"),
						@NamedAttributeNode(value = "buildProduct", subgraph = "buildProduct-productInstance-attributeInstance")
				},
				subgraphs = {
						@NamedSubgraph(
								name = "buildProduct-productInstance-attributeInstance",
								attributeNodes = @NamedAttributeNode("productInstance")
						),
						@NamedSubgraph(
								name = "buildProduct-productInstance-attributeInstance",
								attributeNodes = @NamedAttributeNode("attributeInstance")
						)
				}
		)
})

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
	private String status;
	// -- mapping relationships --
	// mapping category
	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "category_id", referencedColumnName = "id")
	private Category category;


	// mapping attribute
	@OneToMany(mappedBy = "ofProduct", fetch = FetchType.LAZY)
	private List<Attribute> attributes;

	// mapping 3-ary relationship build product
	@OneToMany(mappedBy = "product")
	private List<BuildProduct> buildProduct;
	// mapping seller
	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "seller_id", referencedColumnName = "username")
	private Seller seller;
	// mapping admin
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "admin_product",
			joinColumns = @JoinColumn(name = "product_id", referencedColumnName = "root_product_id"),
			inverseJoinColumns = @JoinColumn(name = "admin_id", referencedColumnName = "username"))
	private List<Admin> admins;
	// mapping img
	@OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
	private List<FileInfo> productImgs;
}
