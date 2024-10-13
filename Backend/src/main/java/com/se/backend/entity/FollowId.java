package com.se.backend.entity;


import lombok.*;

import java.util.Objects;
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FollowId {
	private String followerId;
	private String followeeId;

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		FollowId followId = (FollowId) o;

		if (!Objects.equals(followerId, followId.followerId)) return false;
		return Objects.equals(followeeId, followId.followeeId);
	}
	@Override
	public int hashCode() {
		int result = followerId != null ? followerId.hashCode() : 0;
		result = 31 * result + (followeeId != null ? followeeId.hashCode() : 0);
		return result;
	}
}
