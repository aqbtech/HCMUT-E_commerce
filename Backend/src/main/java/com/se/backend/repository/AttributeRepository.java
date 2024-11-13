package com.se.backend.repository;

import com.se.backend.entity.Attribute;
import com.se.backend.entity.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttributeRepository extends JpaRepository<Attribute, String> {
	@EntityGraph(value = "attribute-detail", type = EntityGraph.EntityGraphType.LOAD)
	Attribute getAttributesById(Long attributeId);
	List<Attribute> findByOfProduct(Product product);
}
