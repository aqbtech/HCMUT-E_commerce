package com.se.backend.repository;

import com.se.backend.entity.ProductInstance;
import com.se.backend.repository.projection.ProductDetailProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductInstanceRepository extends JpaRepository<ProductInstance, String> {
	@Query("SELECT pI.id AS productId, r.reviewContent.rating AS rating, p.description AS description, pI.quantityInStock AS quantityInStock " +
			"FROM ProductInstance pI " +
			"JOIN pI.buildProduct.product p " +
			"JOIN pI.buildProduct.product.seller s " +
			"JOIN pI.buildProduct.product.attributes a " +
			"JOIN pI.review r " +
			"WHERE pI.id = :productId")
	Optional<ProductDetailProjection> findProductDetailProjectionById(@Param("productId") String productId);
}
