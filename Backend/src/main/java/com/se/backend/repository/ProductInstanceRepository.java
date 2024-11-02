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
//	@Query("SELECT pI.id AS productId, r.reviewContent.rating AS rating, p.description AS description, pI.quantityInStock AS quantityInStock " +
//			"FROM ProductInstance pI " +
//			"JOIN pI.buildProduct.product p " +
//			"JOIN pI.buildProduct.product.seller s " +
//			"JOIN pI.buildProduct.product.attributes a " +
//			"JOIN pI.review r " +
//			"WHERE pI.id = :productId")
	@Query(value = "SELECT pI.root_product_instance_id AS productId, " +
			"       r.review_content_id AS rating, " +
			"       p.description AS description, " +
			"       pI.quantity_in_stock AS quantityInStock " +
			"FROM Product_Instance pI " +
			"JOIN Build_Product bp ON pI.root_product_instance_id = bp.product_instance_id " +
			"JOIN Product p ON bp.product_id_r = p.root_product_id " +
			"JOIN Seller s ON p.seller_id = s.username " +
			"JOIN attribute a ON p.root_product_id = a.product_id " +
			"JOIN Review r ON pI.root_product_instance_id = r.product_instance_id " +
			"WHERE pI.root_product_instance_id = :productId;", nativeQuery = true)
	Optional<ProductDetailProjection> findProductDetailProjectionById(@Param("productId") String productId);
}
