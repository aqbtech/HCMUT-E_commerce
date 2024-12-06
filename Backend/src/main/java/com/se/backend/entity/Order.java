package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@NamedEntityGraph(name = "order-Product-Instance", attributeNodes = {
		@NamedAttributeNode(value = "orderProductInstances", subgraph = "productInstance"),
		@NamedAttributeNode("seller")},
		subgraphs = {
				@NamedSubgraph(
						name = "productInstance",
						attributeNodes = @NamedAttributeNode(value = "productInstance", subgraph = "buildProduct")

				),
				@NamedSubgraph(
						name = "buildProduct",
						attributeNodes = @NamedAttributeNode(value = "buildProduct")
				)
		}
)
@NamedEntityGraph(name = "order", attributeNodes = {
		@NamedAttributeNode(value = "orderProductInstances", subgraph = "productInstance"),
		@NamedAttributeNode(value = "paymentOrder", subgraph = "paymentOrder"),
		@NamedAttributeNode("seller")},
		subgraphs = {
				@NamedSubgraph(
						name = "paymentOrder",
						attributeNodes = @NamedAttributeNode(value = "deliveryInfor")

				),
				@NamedSubgraph(
						name = "productInstance",
						attributeNodes = @NamedAttributeNode(value = "productInstance", subgraph = "buildProduct")

				),
				@NamedSubgraph(
						name = "buildProduct",
						attributeNodes = {
								@NamedAttributeNode(value = "buildProduct"),
								@NamedAttributeNode("review")
						}
				)
}
)



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
	private Double totalPrice;

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
	private Double delieryFee;

	// mapping seller
	@ManyToOne
	@JoinColumn(name = "seller_id", referencedColumnName = "username")
	private Seller seller;

	// mapping payment-order
	@ManyToOne
	@JoinColumn(name = "payment_odrder_id", referencedColumnName = "payment_order_id")
	private PaymentOrder paymentOrder;
}
