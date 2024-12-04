package com.se.backend.repository;

import com.se.backend.entity.Category;
import com.se.backend.entity.Follow;
import com.se.backend.entity.FollowId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowRepository extends JpaRepository<Follow, String> {
    Follow findByFollowIdIs(FollowId followId);
}
