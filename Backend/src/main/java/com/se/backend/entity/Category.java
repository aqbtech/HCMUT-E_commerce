package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@NamedEntityGraph(
		name = "category-detail",
		attributeNodes = {
				@NamedAttributeNode("children"),
				@NamedAttributeNode("parentCategory")
		}
)
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "category")
public class Category {
	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(unique = true)
	private String richTextName;
	private String imageLink;

	// -- mapping relationships --
	// mapping parent category
	@ManyToOne
	@JoinColumn(name = "parent_category_id", referencedColumnName = "id")
	private Category parentCategory;
	// mapping children categories
	@OneToMany(mappedBy = "parentCategory", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Category> children;
	// mapping products
	@OneToMany(mappedBy = "category")
	private List<Product> products;
	// support bidirectional relationship
	public void addChild(Category category) {
		this.children.add(category);
		category.setParentCategory(this);
	}
}
