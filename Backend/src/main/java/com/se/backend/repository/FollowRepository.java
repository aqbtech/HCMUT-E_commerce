package com.se.backend.repository;

import com.se.backend.entity.Follow;
import com.se.backend.entity.FollowId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FollowRepository extends JpaRepository<Follow, FollowId> {
    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN TRUE ELSE FALSE END " +
            "FROM Follow f WHERE f.follower.username = :buyername AND f.followee.username = :sellername")
    boolean existsByBuyerAndSeller(@Param("buyername") String buyername, @Param("sellername") String sellername);
    Follow findByFollowIdIs(FollowId followId);

}
