package com.se.backend.service;

import com.se.backend.dto.request.ApiCategoryInfo;
import com.se.backend.dto.response.CategoryInfo;
import com.se.backend.entity.Category;
import com.se.backend.entity.Product;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.mapper.CategoryMapper;
import com.se.backend.repository.CategoryRepository;
import com.se.backend.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {
	private final CategoryRepository categoryRepository;
	private final CategoryMapper categoryMapper;
	private final ProductRepository productRepository;

	@Override
	public Page<CategoryInfo> getAllRootCategory(Pageable pageable) {
		Page<Category> categories = categoryRepository.findAllByParentCategoryIsNull(pageable);
		return map(categories);
	}

	private Page<CategoryInfo> map(Page<Category> categories) {
		return categories.map(category -> CategoryInfo.builder()
				.id(category.getId())
				.richTextName(category.getRichTextName())
				.imageLink(category.getImageLink())
				.parentId(category.getParentCategory() == null ? null : category.getParentCategory().getId())
				.children(categoryMapper.toCategoryInfoList(category.getChildren()))
				.build());
	}

	@Override
	public Page<CategoryInfo> getAll(Pageable pageable) {
		Page<Category> categories = categoryRepository.findAll(pageable);
		return map(categories);
	}

	@Override
	@Transactional
	public CategoryInfo addCategory(ApiCategoryInfo categoryInfo) {
		Category parentCategory = categoryRepository.findCategoryById(categoryInfo.getParentId())
				.orElse(null);
		if (parentCategory == null && categoryInfo.getParentId() != null) {
			throw new WebServerException(ErrorCode.CATEGORY_NOT_FOUND);
		}
		Category category = Category.builder()
				.richTextName(categoryInfo.getRichTextName())
				.imageLink(categoryInfo.getImageLink())
				.parentCategory(parentCategory)
				.build();
		if (parentCategory != null) {
			parentCategory.addChild(category);
		}
		try {
			Category category1 = categoryRepository.save(category);
			if (parentCategory != null) {
				categoryRepository.save(parentCategory);
			}
			return categoryMapper.toCategoryInfo(category1);
		} catch (Exception e) {
			log.error("Error while adding category: {}", e.getMessage());
			throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
		}
	}

	@Override
	public CategoryInfo updateCategory(Long id, ApiCategoryInfo categoryInfo) {
		Category category = categoryRepository.findCategoryById(id)
				.orElseThrow(() -> new WebServerException(ErrorCode.CATEGORY_NOT_FOUND));
		Category parentCategory = categoryRepository.findCategoryById(categoryInfo.getParentId())
				.orElse(null);
		if (parentCategory == null && categoryInfo.getParentId() != null) {
			throw new WebServerException(ErrorCode.CATEGORY_NOT_FOUND);
		}

		if (categoryInfo.getImageLink() != null) {
			category.setImageLink(categoryInfo.getImageLink());
		}
		if (categoryInfo.getRichTextName() != null) {
			category.setRichTextName(categoryInfo.getRichTextName());
		}
		if (categoryInfo.getParentId() != null) {
			if (parentCategory != null) {
				parentCategory.getChildren().remove(category);
				category.setParentCategory(parentCategory);
				parentCategory.addChild(category);
			} else {
				Category newParentCategory = categoryRepository.findCategoryById(categoryInfo.getParentId())
						.orElseThrow(() -> new WebServerException(ErrorCode.CATEGORY_NOT_FOUND));
				category.setParentCategory(newParentCategory);
				newParentCategory.addChild(category);
				try {
					categoryRepository.save(newParentCategory);
				} catch (Exception e) {
					log.error("Error while add parent cat in updating category: {}", e.getMessage());
					throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
				}
			}
		}
		try {
			Category category1 = categoryRepository.save(category);
			return categoryMapper.toCategoryInfo(category1);
		} catch (Exception e) {
			log.error("Error while updating category: {}", e.getMessage());
			throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
		}
	}

	@Override
	@Transactional
	public void deleteCategory(Long id, boolean forceDelete) {
		Category category = categoryRepository.findCategoryById(id)
				.orElseThrow(() -> new WebServerException(ErrorCode.CATEGORY_NOT_FOUND));
		// use tree algorithm to delete
		if (forceDelete) {
			setRootProduct(category);
			categoryRepository.delete(category);
		} else {
			// check if category have children
			if (!category.getChildren().isEmpty()) {
				log.error("Category {} has children", category.getRichTextName());
				throw new WebServerException(ErrorCode.CATEGORY_HAS_CHILDREN);
			}
			if (!category.getProducts().isEmpty()) {
				setRootProduct(category);
				// delete this category
			}
			categoryRepository.delete(category);
		}
	}

	private void setRootProduct(Category category) {
		Category rootUncategorized = categoryRepository.findCategoryById(1L)
				.orElse(null);
		if (rootUncategorized == null) {
			Category root = Category.builder()
					.richTextName("Uncategorized")
					.build();
			categoryRepository.save(root);
		}
		for (Product product : category.getProducts()) {
			product.setCategory(rootUncategorized);
			productRepository.save(product);
		}
	}
}
