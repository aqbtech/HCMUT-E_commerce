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
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "business")
public class Business extends User {
	// -- mapping relationships --
	// mapping payment infor
	@OneToMany(mappedBy = "business")
	private List<PaymentInfo> paymentInfor;
}
