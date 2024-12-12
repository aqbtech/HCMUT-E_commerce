package com.se.backend.repository;

import com.se.backend.entity.CategoryPolicy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryPolicyRepository extends JpaRepository<CategoryPolicy, Long> {
    @Query("SELECT cp FROM CategoryPolicy cp JOIN cp.categories c WHERE c.richTextName = :categoryId")
    List<CategoryPolicy> findCategoryId(@Param("categoryId") String id);
    // Refactor: fetch paging first after that fetch collection to avoid in memory paging
    @EntityGraph(value = "categoryPolicy", type = EntityGraph.EntityGraphType.LOAD)
    @NonNull
    Page<CategoryPolicy> findAll(@NonNull Pageable pageable);
}
