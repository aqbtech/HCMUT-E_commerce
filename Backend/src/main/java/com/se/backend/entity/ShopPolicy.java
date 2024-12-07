package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@NamedEntityGraphs(
		@NamedEntityGraph(name = "shopPolicy", attributeNodes = {
				@NamedAttributeNode("sellers")
		}
		)
)
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "shop_policy")
public class ShopPolicy extends Policy {
	// -- mapping relationships --
	// mapping seller
	@ManyToMany
	@JoinTable(name = "shop_policy_seller_not_have_admin",
			joinColumns = @JoinColumn(name = "policy_id", referencedColumnName = "policy_id"),
			inverseJoinColumns = @JoinColumn(name = "seller_id", referencedColumnName = "username"))
	private List<Seller> sellers;
	// mapping admin
	@ManyToMany
	@JoinTable(name = "shop_policy_admin",
			joinColumns = @JoinColumn(name = "policy_id", referencedColumnName = "policy_id"),
			inverseJoinColumns = @JoinColumn(name = "admin_id", referencedColumnName = "username"))
	private List<Admin> admins;
}
