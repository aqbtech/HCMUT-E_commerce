package com.se.backend.repository;

import com.se.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
	boolean existsByUsername(String username);

	@Query("SELECT u.username, u.password, " +
			"CASE WHEN a.username IS NOT NULL THEN 'ADMIN' " +
			"     WHEN b.username IS NOT NULL THEN 'BUYER' " +
			"     WHEN s.username IS NOT NULL THEN 'SELLER' " +
			"     ELSE 'UNKNOWN' END AS role " +
			"FROM User u " +
			"LEFT JOIN Admin a ON u.username = a.username " +
			"LEFT JOIN Buyer b ON u.username = b.username " +
			"LEFT JOIN Seller s ON u.username = s.username " +
			"WHERE u.username = :username")
	List<Object[]> findUserWithRoleByUsername(@Param("username") String username);

}
