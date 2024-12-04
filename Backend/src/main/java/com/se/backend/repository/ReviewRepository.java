package com.se.backend.repository;

import com.se.backend.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, ReviewId> {
	@Query("SELECT r FROM Review r JOIN r.productInstance pi JOIN pi.buildProduct bp WHERE bp.product = :product")
	List<Review> findReviewByProductId(@Param("product") Product product);

	Review findReviewByPaymentOrderAndProductInstance(PaymentOrder paymentOrder, ProductInstance productInstance);
}
