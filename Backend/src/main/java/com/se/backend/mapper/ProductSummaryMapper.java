package com.se.backend.mapper;

import com.se.backend.dto.response.ProductSummary;
import com.se.backend.entity.Product;

import java.util.List;

public interface ProductSummaryMapper {
	ProductSummary toProductSummary(Product product);

	List<ProductSummary> toProductSummaries(List<Product> products);
}
