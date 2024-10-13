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
@Table(name = "admin")
public class Admin extends User {
	// -- mapping relationships --
	// mapping activity
	@OneToMany(mappedBy = "admin")
	private List<Activity> activities;
	// mapping shop-policy
	@ManyToMany(mappedBy = "admins")
	private List<ShopPolicy> shopPolicies;
	// mapping category-policy
	@ManyToMany(mappedBy = "admins")
	private List<CategoryPolicy> categoryPolicies;
	// mapping management product
	@ManyToMany(mappedBy = "admins")
	private List<Product> products;
	// mapping management seller
	@ManyToMany(mappedBy = "admins")
	private List<Seller> sellers;
	// mapping management buyer
	@ManyToMany(mappedBy = "admins")
	private List<Buyer> buyers;
}
