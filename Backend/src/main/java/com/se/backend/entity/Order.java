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
@Table(name = "orders")
public class Order {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "root_order_id")
	private String orderId;
	private String status;
	private Long totalPrice;

	// -- mapping relationships --
	// mapping product instances
	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
	private List<Order_ProductInstance> orderProductInstances;

	// mapping delivery
	@ManyToOne
	@JoinColumn(name = "delivery_id", referencedColumnName = "delivery_name")
	private Delivery delivery;
	private String deliveryCode;
	private LocalDate expectedDeliveryDate;
	private LocalDate deliveryDate;
	private LocalDate deliveryJoinDate;
	private String deliveryStatus;

	// mapping seller
	@ManyToOne
	@JoinColumn(name = "seller_id", referencedColumnName = "username")
	private Seller seller;

	// mapping payment-order
	@ManyToOne
	@JoinColumn(name = "payment_odrder_id", referencedColumnName = "payment_order_id")
	private PaymentOrder paymentOrder;
}