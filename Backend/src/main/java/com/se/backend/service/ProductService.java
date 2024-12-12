package com.se.backend.service;

import com.se.backend.entity.Product;
import com.se.backend.entity.ProductInstance;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {
	Long totalQuantityInStock(String productId);
	Double minPriceOf(String productId);
	Double maxPriceOf(String productId);
	Product findByProductInstance(ProductInstance productInstance);
	List<Product> productWithImgs(Page<Product> products);
}
