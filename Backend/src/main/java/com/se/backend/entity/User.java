package com.se.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
	@Id
	private String username;
	private String password;
	private String firstName;
	private String lastName;
	private String email;
	private String phone;
	//.dateOfBirth
	// create dateOfBirth field
}
