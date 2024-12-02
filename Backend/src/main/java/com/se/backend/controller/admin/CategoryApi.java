package com.se.backend.controller.admin;

import com.se.backend.dto.request.ApiCategoryInfo;
import com.se.backend.dto.response.CategoryInfo;
import com.se.backend.dto.response.ResponseAPITemplate;
import com.se.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/category")
@RequiredArgsConstructor
public class CategoryApi {
	private final CategoryService categoryService;

	@GetMapping("/root")
	public ResponseAPITemplate<Page<?>> getAllRootCategory(@RequestParam(defaultValue = "0") int page,
															@RequestParam(defaultValue = "10") int size) {
		Pageable pageable = PageRequest.of(page, size);
		Page<CategoryInfo> res = categoryService.getAllRootCategory(pageable);
		return ResponseAPITemplate.<Page<?>>builder().result(res).build();
	}
	@GetMapping("/all")
	public ResponseAPITemplate<Page<?>> getAll(@RequestParam(defaultValue = "0") int page,
											   @RequestParam(defaultValue = "10") int size) {
		Pageable pageable = PageRequest.of(page, size);
		Page<CategoryInfo> res = categoryService.getAll(pageable);
		return ResponseAPITemplate.<Page<?>>builder().result(res).build();
	}

	@PostMapping("/add-category")
	public ResponseAPITemplate<?> addCategory(@RequestBody ApiCategoryInfo categoryInfo) {
		CategoryInfo res = categoryService.addCategory(categoryInfo);
		return ResponseAPITemplate.builder().result(res).build();
	}

	@PutMapping("/update-category")
	public ResponseAPITemplate<?> updateCategory(@Param("id") Long id, @RequestBody ApiCategoryInfo categoryInfo) {
		CategoryInfo res = categoryService.updateCategory(id, categoryInfo);
		return ResponseAPITemplate.builder().result(res).build();
	}

	@DeleteMapping("/delete-category")
	public ResponseAPITemplate<?> deleteCategory(@Param("id") Long id,
												 @RequestParam(value = "force", defaultValue = "false") boolean forceDelete) {
		categoryService.deleteCategory(id, forceDelete);
		return ResponseAPITemplate.builder().build();
	}
}
