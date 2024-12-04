package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SoftDelete;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "delivery_infor")
public class DeliveryInfor {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String phoneNumber;
	private String recipientName;
	private boolean deleted = Boolean.FALSE;
	// -- mapping relationships --
	// mapping address
	@OneToOne(optional = false, fetch = FetchType.EAGER)
	@JoinColumn(name = "address_id", referencedColumnName = "address_id")
	private Address address;
	// mapping buyer
	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "buyer_id", referencedColumnName = "username")
	private Buyer buyer;
	// mapping payment order
	@OneToMany(mappedBy = "deliveryInfor")
	private List<PaymentOrder> paymentOrder;
}
