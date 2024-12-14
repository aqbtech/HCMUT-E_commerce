package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
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
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "payment_order_id")
	private Long paymentOrderCode;
	private String payment_method;
	private Boolean isCOD; // 0 da thanh toan, 1 chua thanh toan, 2 dang xu ly
	private LocalDate createDate;
	private String appTransId;
	// -- Relationships -- //
	// mapping delivery info
	@ManyToOne(optional = false)
	@JoinColumn(name = "delivery_info", referencedColumnName = "id")
	private DeliveryInfor deliveryInfor;
	// mapping with review
	@OneToMany(mappedBy = "paymentOrder")
	private List<Review> review;
	// mapping order
	@OneToMany(mappedBy = "paymentOrder")
	private List<Order> order;
}
