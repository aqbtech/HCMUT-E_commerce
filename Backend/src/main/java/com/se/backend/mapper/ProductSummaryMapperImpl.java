package com.se.backend.mapper;

import com.se.backend.dto.response.ProductSummary;
import com.se.backend.entity.Product;
import com.se.backend.service.ProductService;
import com.se.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
@Component
@RequiredArgsConstructor
public class ProductSummaryMapperImpl implements ProductSummaryMapper {
	private final ReviewService reviewService;
	private final ProductService productService;
	public ProductSummary toProductSummary(Product product) {
		if ( product == null ) {
			return null;
		}

		ProductSummary productSummary = new ProductSummary();
		productSummary.setProductId( product.getId() );
		productSummary.setName( product.getName() );
		productSummary.setRating( reviewService.ratingCalculator( product.getId() ) );
		productSummary.setMinPrice( productService.minPriceOf( product.getId() ) );
		productSummary.setImg( null ); // dummy value
		return productSummary;
	}


	public List<ProductSummary> toProductSummaries(List<Product> products) {
		if ( products == null ) {
			return null;
		}

		List<ProductSummary> list = new ArrayList<ProductSummary>( products.size() );
		for ( Product product : products ) {
			list.add( toProductSummary( product ) );
		}

		return list;
	}
}
