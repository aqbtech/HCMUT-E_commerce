package com.se.backend.repository;

import com.se.backend.entity.Review;
import com.se.backend.entity.ReviewId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, ReviewId> {
	@Query("SELECT r FROM Review r JOIN r.productInstance.buildProduct.product r2 WHERE r2.id = :productId")
	List<Review> findReviewByProductId(@Param("productId") String productId);
}
