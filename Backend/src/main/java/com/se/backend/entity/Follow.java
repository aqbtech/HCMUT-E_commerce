package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "follow")
public class Follow {
	@EmbeddedId
	private FollowId followId;

	// -- mapping relationships --
	// mapping follower - buyer
	@ManyToOne
	@MapsId("followerId")
	@JoinColumn(name = "follower_id", referencedColumnName = "username")
	private Buyer follower;
	// mapping followee - seller
	@ManyToOne
	@MapsId("followeeId")
	@JoinColumn(name = "followee_id", referencedColumnName = "username")
	private Seller followee;
}
