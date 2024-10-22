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
@Table(name = "buyer")
public class Buyer extends Business {
	// -- mapping relationships --
	// mapping delivery infor
	@OneToMany(mappedBy = "buyer")
	private List<DeliveryInfor> deliveryInfor;
	// mapping cart
	@OneToOne(optional = false, mappedBy = "buyer")
	private Cart cart;
	// mapping payment order
	@OneToMany(mappedBy = "buyer")
	private List<PaymentOrder> paymentOrder;
	// mapping reviews
	@OneToOne(mappedBy = "buyer")
	private Review reviews;
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
