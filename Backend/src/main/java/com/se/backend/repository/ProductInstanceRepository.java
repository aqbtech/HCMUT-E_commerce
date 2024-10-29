package com.se.backend.repository;

import com.se.backend.entity.ProductInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductInstanceRepository extends JpaRepository<ProductInstance, String> {
}
