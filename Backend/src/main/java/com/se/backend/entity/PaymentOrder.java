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
@Table(name = "payment_order")
public class PaymentOrder {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "payment_order_id")
	private String paymentOrderCode;

	// -- Relationships -- //
	// mapping buyer
	@ManyToOne(optional = false)
	@JoinColumn(name = "buyer_id", referencedColumnName = "username")
	private Buyer buyer;
	// mapping with review
	@OneToMany(mappedBy = "paymentOrder")
	private List<Review> review;
	// mapping order
	@OneToMany(mappedBy = "paymentOrder")
	private List<Order> order;
}
