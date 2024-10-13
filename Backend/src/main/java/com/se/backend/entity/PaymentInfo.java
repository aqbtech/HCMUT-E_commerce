package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "payment_info")
public class PaymentInfo {
	@Id
	private String cardNumber;
	private String cardHolderName;
	private String bankName;

	// -- mapping relationships --
	// mapping business
	@ManyToOne
	@JoinColumn(name = "business_id", referencedColumnName = "username")
	private Business business;
}
