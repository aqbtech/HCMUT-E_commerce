package com.se.backend.repository;

import com.se.backend.entity.CategoryPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryPolicyRepository extends JpaRepository<CategoryPolicy, Long> {
    @Query("SELECT cp FROM CategoryPolicy cp JOIN cp.categories c WHERE c.richTextName = :categoryId")
    List<CategoryPolicy> findCategoryId(@Param("categoryId") String id);
}
