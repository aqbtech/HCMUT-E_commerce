package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "activity")
public class Activity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "activity_id")
	private Long activityId;
	private String activityName;
	private String activityDescription;
	private LocalDate activityDate;

	// -- mapping relationships --
	// mapping admin
	@ManyToOne
	@JoinColumn(name = "admin_id", referencedColumnName = "username")
	private Admin admin;
}
