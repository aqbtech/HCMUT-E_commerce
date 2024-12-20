package com.se.backend.repository;

import com.se.backend.entity.FileInfo;
import com.se.backend.entity.Product;
import com.se.backend.entity.Seller;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
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
	@NonNull
	List<Product> findAll(Specification<Product> spec);

	@EntityGraph(value = "product-summary", type = EntityGraph.EntityGraphType.LOAD)
	List<Product> findBySeller(Seller seller);

	@EntityGraph(value = "product-summary-seller", type = EntityGraph.EntityGraphType.LOAD)
	Page<Product> findProductBySeller(Seller seller, Pageable pageable);

	@EntityGraph(value = "product-summary-seller", type = EntityGraph.EntityGraphType.LOAD)
	@Query("select p from Product p")
	Page<Product> findAllProductAdmin(Pageable pageable);

	// separate query of product summary
	@NonNull
	@EntityGraph(value = "product-summary-without-imgs", type = EntityGraph.EntityGraphType.LOAD)
	Page<Product> findAll(@NonNull Pageable pageable);
	@Query("SELECT p.productImgs FROM Product p WHERE p IN :products")
	List<FileInfo> fetchProductImages(@Param("products") List<Product> products);
}
