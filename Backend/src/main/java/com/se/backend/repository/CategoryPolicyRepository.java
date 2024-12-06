package com.se.backend.repository;

import com.se.backend.entity.CategoryPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryPolicyRepository extends JpaRepository<CategoryPolicy, Long> {
}
