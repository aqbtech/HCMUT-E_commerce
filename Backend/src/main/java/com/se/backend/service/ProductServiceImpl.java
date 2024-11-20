package com.se.backend.service;


import com.se.backend.entity.BuildProduct;
import com.se.backend.entity.Product;
import com.se.backend.entity.ProductInstance;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.repository.BuildProductRepository;
import com.se.backend.repository.ProductInstanceRepository;
import com.se.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
	private final ProductRepository productRepository;
	private final ProductInstanceRepository productInstanceRepository;
	private final BuildProductRepository buildProductRepository;

	private List<ProductInstance> initListProductInstance(String productId) {
		return productInstanceRepository.findByBuildProductProduct(productRepository.findById(productId)
				.orElseThrow(() -> new WebServerException(ErrorCode.PRODUCT_NOT_FOUND)));
	}

	@Override
	public Long totalQuantityInStock(String productId) {
		List<ProductInstance> productInstances = initListProductInstance(productId);
		return productInstances.stream().mapToLong(ProductInstance::getQuantityInStock).sum();
	}

	public Double minPriceOf(String productId) {
		List<ProductInstance> productInstances = initListProductInstance(productId);
		return productInstances.stream().mapToDouble(ProductInstance::getPrice).min().orElse(0);
	}

	public Double maxPriceOf(String productId) {
		List<ProductInstance> productInstances = initListProductInstance(productId);
		return productInstances.stream().mapToDouble(ProductInstance::getPrice).max().orElse(0);
	}

	@Override
	public Product findByProductInstance(ProductInstance productInstance) {
		List<BuildProduct> bp = buildProductRepository.findByProductInstance(productInstance)
				.orElseThrow(() -> new WebServerException(ErrorCode.PRODUCT_NOT_FOUND));
		return productRepository.findProductCartById(bp.getFirst().getId().getProductId());
	}
}
