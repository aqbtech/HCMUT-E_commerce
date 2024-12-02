package com.se.backend.mapper;

import com.se.backend.dto.response.ProductSummaryResponseForSeller;
import com.se.backend.entity.Product;

import java.util.List;

public interface ProductSummaryForSellerMapper {
    ProductSummaryResponseForSeller toProductSummaryForSeller(Product product);
    List<ProductSummaryResponseForSeller> toProductSummariesForSeller(List<Product> products);
}
