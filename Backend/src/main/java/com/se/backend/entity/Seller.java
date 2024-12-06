package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "seller")
public class Seller extends Business {
	private String shopName;
	private Boolean status;
	private Integer followers;

	// -- mapping relationships --
	// mapping address
	@OneToOne(optional = false)
	@JoinColumn(name = "address_id", referencedColumnName = "address_id")
	private Address address;
	// mapping order
	@OneToMany(mappedBy = "seller")
	private List<Order> order;
	// mapping review-content
	@OneToMany(mappedBy = "seller")
	private List<ReviewContent> reviewContent;
	// mapping product
	@OneToMany(mappedBy = "seller")
	private List<Product> product;
	// mapping follow
	@OneToMany(mappedBy = "followee")
	private List<Follow> follow;
	// mapping shop-policy
	@ManyToMany(mappedBy = "sellers")
	private List<ShopPolicy> shopPolicies;
	// mapping admin
	@ManyToMany
	@JoinTable(name = "shop_policy_seller",
			joinColumns = @JoinColumn(name = "seller_id", referencedColumnName = "username"),
			inverseJoinColumns = @JoinColumn(name = "admin_id", referencedColumnName = "username"))
	private List<Admin> admins;
}
