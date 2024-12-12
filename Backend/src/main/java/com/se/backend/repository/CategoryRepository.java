package com.se.backend.repository;

import com.se.backend.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
	@EntityGraph(value = "category-detail", type = EntityGraph.EntityGraphType.LOAD)
	Optional<Category> findCategoryById(Long id);

	// Refactor: avoid in memory paging
	@EntityGraph(value = "category-detail", type = EntityGraph.EntityGraphType.LOAD)
	@NonNull
	Page<Category> findAll(@NonNull Pageable pageable);
	@EntityGraph(value = "category-detail", type = EntityGraph.EntityGraphType.LOAD)
	Page<Category> findAllByParentCategoryIsNull(Pageable pageable);

	Category findByRichTextName(String richTextName);
}
