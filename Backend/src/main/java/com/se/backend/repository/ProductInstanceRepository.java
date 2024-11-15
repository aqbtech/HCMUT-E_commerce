package com.se.backend.repository;

import com.se.backend.entity.Product;
import com.se.backend.entity.ProductInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductInstanceRepository extends JpaRepository<ProductInstance, String> {
	List<ProductInstance> findByBuildProductProduct(Product product);


}
