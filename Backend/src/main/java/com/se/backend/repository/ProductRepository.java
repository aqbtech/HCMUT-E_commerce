package com.se.backend.repository;

import com.se.backend.entity.Product;

import org.hibernate.mapping.Selectable;

import com.se.backend.entity.Seller;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String>, JpaSpecificationExecutor<Product> {
	@EntityGraph(value = "product-summary", type = EntityGraph.EntityGraphType.LOAD)
	Product findProductSummaryById(String productId);

	@EntityGraph(value = "product-detail", type = EntityGraph.EntityGraphType.LOAD)
	Optional<Product> findProductDetailedById(String productId);

	@EntityGraph(value = "product-detail", type = EntityGraph.EntityGraphType.LOAD)
	Product findProductById(String productId);

	@EntityGraph(value = "product-attribute", type = EntityGraph.EntityGraphType.LOAD)
	Product findProductCartById(String productId);

	@EntityGraph(value = "product", type = EntityGraph.EntityGraphType.LOAD)
	Product findBasicProductById(String productId);

	@EntityGraph(value = "product-summary", type = EntityGraph.EntityGraphType.LOAD)
	Page<Product> findByNameContaining(String keyword, Pageable pageable);
	@EntityGraph(value = "product-summary", type = EntityGraph.EntityGraphType.LOAD)
	List<Product> findAll(Specification<Product> spec);
	List<Product> findBySeller(Seller seller);
	Page<Product> findProductBySeller(Seller seller, Pageable pageable);
}
