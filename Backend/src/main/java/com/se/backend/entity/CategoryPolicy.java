package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@NamedEntityGraphs(
		@NamedEntityGraph(name = "categoryPolicy", attributeNodes = {
				@NamedAttributeNode("categories")
		}
		)
)
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "category_policy")
public class CategoryPolicy extends Policy {
	// -- mapping relationships --
	// mapping category
	@ManyToMany
	@JoinTable(name = "category_policy_category",
			joinColumns = @JoinColumn(name = "policy_id", referencedColumnName = "policy_id"),
			inverseJoinColumns = @JoinColumn(name = "category_id", referencedColumnName = "id"))
	private List<Category> categories;
	// mapping admin
	@ManyToMany
	@JoinTable(name = "category_policy_admin",
			joinColumns = @JoinColumn(name = "policy_id", referencedColumnName = "policy_id"),
			inverseJoinColumns = @JoinColumn(name = "admin_id", referencedColumnName = "username"))
	private List<Admin> admins;
}
