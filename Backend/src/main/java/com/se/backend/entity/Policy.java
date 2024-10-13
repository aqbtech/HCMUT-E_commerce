package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass
public abstract class Policy {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "policy_id")
	private Long policyId;
	private String policyName;
	private String policyDescription;
	private LocalDate releaseDate;
	private LocalDate applyDate;
}
