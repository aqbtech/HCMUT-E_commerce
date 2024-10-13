package com.se.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.util.Date;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InvalidatedToken {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private String id;
	private Date expiryTime;
}
