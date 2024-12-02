package com.se.backend.mapper;

import com.se.backend.dto.response.CategoryInfo;
import com.se.backend.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
	@Mapping(target = "children", ignore = true)
	@Mapping(target = "parentId", source = "parentCategory.id")
	CategoryInfo toCategoryInfo(Category category);

	List<CategoryInfo> toCategoryInfoList(List<Category> categories);
}
