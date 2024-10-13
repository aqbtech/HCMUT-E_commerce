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
@Table(name = "category")
public class Category {
	@Id
	@Column(name = "name")
	private String name;

	// -- mapping relationships --
	// mapping parent category
	@ManyToOne
	@JoinColumn(name = "parent_category_name", referencedColumnName = "name")
	private Category parentCategory;
	// mapping children categories
	@OneToMany(mappedBy = "parentCategory")
	private List<Category> children;
	// mapping products
	@OneToMany(mappedBy = "category")
	private List<Product> products;
}
