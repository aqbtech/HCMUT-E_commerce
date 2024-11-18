package com.se.backend.repository;

import com.se.backend.entity.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
	@EntityGraph(value = "product-summary", type = EntityGraph.EntityGraphType.LOAD)
	Product findProductSummaryById(String productId);

	@EntityGraph(value = "product-detail", type = EntityGraph.EntityGraphType.LOAD)
	Optional<Product> findProductDetailedById(String productId);

	@EntityGraph(value = "product-detail", type = EntityGraph.EntityGraphType.LOAD)
	Product findProductById(String productId);
}
