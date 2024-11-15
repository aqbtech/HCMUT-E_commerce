package com.se.backend.repository;

import com.se.backend.entity.BuildProduct;
import com.se.backend.entity.BuildProductId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuildProductRepository extends JpaRepository<BuildProduct, BuildProductId> {

}
