package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "review")
public class Review {
	@EmbeddedId
	private ReviewId reviewId;

	// -- Relationships -- //
	// mapping with Buyer
	@ManyToOne
	@MapsId("buyerUsername")
	@JoinColumn(name = "buyer_username", referencedColumnName = "username"
			, columnDefinition = "VARCHAR(64)")
	private Buyer buyer;
	// mapping with ReviewContent
	@OneToOne
	@MapsId("reviewContentId")
	@JoinColumn(name = "review_content_id", referencedColumnName = "root_review_content_id"
			, columnDefinition = "VARCHAR(64)")
	private ReviewContent reviewContent;
	// mapping with ProductInstance
	@ManyToOne
	@MapsId("productInstanceId")
	@JoinColumn(name = "product_instance_id", referencedColumnName = "root_product_instance_id"
			, columnDefinition = "VARCHAR(64)")
	private ProductInstance productInstance;
	// mapping with PaymentOrder
	@ManyToOne
	@MapsId("paymentOrderId")
	@JoinColumn(name = "payment_order_id", referencedColumnName = "payment_order_id")
	private PaymentOrder paymentOrder;
}
