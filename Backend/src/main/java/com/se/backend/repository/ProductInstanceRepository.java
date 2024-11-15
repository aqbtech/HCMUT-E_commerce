package com.se.backend.repository;

import com.se.backend.dto.response.ProductDetail;
import com.se.backend.entity.Product;
import com.se.backend.entity.ProductInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductInstanceRepository extends JpaRepository<ProductInstance, String> {
	@Query("SELECT p.id AS productId, p.description AS description, pI.quantityInStock AS quantityInStock, " +
			"s.username as sellerId, s.shopName as shopName, s.address.province as location, " +
			"a.name AS attribute_name, a.attributeInstances AS attribute_values, " +
			"r.reviewId.reviewContentId AS reviewReviewId, r.buyer.lastName AS reviewReviewerName, r.reviewContent.content AS reviewContentReview, r.reviewContent.rating AS reviewRating " +
			"FROM Product p " +
			"JOIN p.buildProduct.productInstance pI " +
			"JOIN p.seller s " +
			"JOIN p.attributes a " +
			"JOIN pI.review r " +
			"WHERE p.id = :productId")
	Optional<ProductDetail> findProductDetailProjectionById(@Param("productId") String productId);

	List<ProductInstance> findByBuildProductProduct(Product product);


}
