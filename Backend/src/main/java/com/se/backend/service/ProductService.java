package com.se.backend.service;

import com.se.backend.entity.ProductInstance;

import java.util.List;

public interface ProductService {
	Long totalQuantityInStock(String productId);
	Double minPriceOf(String productId);
	Double maxPriceOf(String productId);
}
