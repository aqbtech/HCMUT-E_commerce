package com.se.backend.repository;

import com.se.backend.entity.Attribute;
import com.se.backend.entity.AttributeInstance;
import com.se.backend.entity.ProductInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttributeInsRepository extends JpaRepository<AttributeInstance, Long> {
	List<AttributeInstance> findByAttribute(Attribute attribute);
}
