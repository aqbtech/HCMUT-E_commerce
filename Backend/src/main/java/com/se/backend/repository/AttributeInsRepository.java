package com.se.backend.repository;

import com.se.backend.entity.Attribute;
import com.se.backend.entity.AttributeInstance;
import com.se.backend.entity.AttributeInstanceId;
import com.se.backend.entity.ProductInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttributeInsRepository extends JpaRepository<AttributeInstance, AttributeInstanceId> {
	List<AttributeInstance> findByAttribute(Attribute attribute);
	@Query("SELECT ai FROM AttributeInstance ai " +
			"JOIN ai.buildProducts bp " +
			"WHERE bp.productInstance = :productInstance")
	List<AttributeInstance> findAttributeInstancesBy(ProductInstance productInstance);
}
