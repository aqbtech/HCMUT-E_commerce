package com.se.backend.repository.projection;

import com.se.backend.dto.response.ProductDetail;

import java.util.List;

public interface ProductDetailProjection {
	String getProductId();
	double getRating();
	String getDescription();
	int getQuantityInStock();

	ProductDetail.Seller getSeller();
	List<ProductDetail.Attribute> getAttributes();
	List<ProductDetail.Review> getReviews();
}

