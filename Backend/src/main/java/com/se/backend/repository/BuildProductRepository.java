package com.se.backend.repository;

import com.se.backend.entity.BuildProduct;
import com.se.backend.entity.BuildProductId;
import com.se.backend.entity.Product;
import com.se.backend.entity.ProductInstance;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BuildProductRepository extends JpaRepository<BuildProduct, BuildProductId> {
	Optional<List<BuildProduct>> findByProductInstance(ProductInstance productInstance);

}
