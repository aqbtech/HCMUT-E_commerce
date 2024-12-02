package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@NamedEntityGraphs({
		@NamedEntityGraph(name = "buyer-minimal",
				attributeNodes = {
						@NamedAttributeNode("cart"),
				})
})
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "buyer")
public class Buyer extends Business {
	// -- mapping relationships --
	// mapping delivery infor
	@OneToMany(mappedBy = "buyer")
	private List<DeliveryInfor> deliveryInfor;
	// mapping cart
	@OneToOne(optional = false, mappedBy = "buyer", cascade = CascadeType.ALL)
	private Cart cart;
	// mapping reviews
	@OneToMany(mappedBy = "buyer")
	private List<Review> reviews;
	// mapping follow
	@OneToMany(mappedBy = "follower")
	private List<Follow> follow;
	// mapping admin
	@ManyToMany
	@JoinTable(name = "admin_buyer",
			joinColumns = @JoinColumn(name = "buyer_id", referencedColumnName = "username"),
			inverseJoinColumns = @JoinColumn(name = "admin_id", referencedColumnName = "username"))
	private List<Admin> admins;
}
