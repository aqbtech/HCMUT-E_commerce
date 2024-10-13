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
@Table(name = "delivery")
public class Delivery {
	@Id
	@Column(name = "delivery_name")
	private String deliveryName;

	// -- mapping relationships --
	// mapping order
	@OneToMany(mappedBy = "delivery")
	private List<Order> order;
}
