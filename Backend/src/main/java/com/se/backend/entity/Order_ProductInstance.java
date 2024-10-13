package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Order_ProductInstance {
	@EmbeddedId
	private Order_ProductInstanceId order_productInstanceId;
	private Long quantity;

	// -- mapping relationships --
	// mapping order
	@ManyToOne
	@MapsId("orderId")
	@JoinColumn(name = "order_id", referencedColumnName = "root_order_id")
	private Order order;
	// mapping product instance
	@ManyToOne
	@MapsId("productInstanceId")
	@JoinColumn(name = "product_instance_id", referencedColumnName = "root_product_instance_id")
	private ProductInstance productInstance;
}
