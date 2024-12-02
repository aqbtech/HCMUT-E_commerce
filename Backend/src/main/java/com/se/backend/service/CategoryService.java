package com.se.backend.service;

import com.se.backend.dto.request.ApiCategoryInfo;
import com.se.backend.dto.response.CategoryInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryService {
	Page<CategoryInfo> getAllRootCategory(Pageable pageable);
	Page<CategoryInfo> getAll(Pageable pageable);
	CategoryInfo addCategory(ApiCategoryInfo categoryInfo);
	CategoryInfo updateCategory(Long id, ApiCategoryInfo categoryInfo);
	void deleteCategory(Long id, boolean forceDelete);
}
