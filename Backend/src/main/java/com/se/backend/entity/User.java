package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "user")
public class User {
	@Id
	@Column(unique = true)
	private String username;
	@Version
	private Long version;
	private String password;
	private String firstName;
	private String lastName;
	private String email;
	private String phone;
	private LocalDate dob;
	private LocalDate createdDate;
}
