package com.se.backend.repository;

import com.se.backend.entity.Attribute;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttributeRepository extends JpaRepository<Attribute, String> {
	@EntityGraph(value = "attribute-detail", type = EntityGraph.EntityGraphType.LOAD)
	Attribute getAttributesById(Long attributeId);
}
