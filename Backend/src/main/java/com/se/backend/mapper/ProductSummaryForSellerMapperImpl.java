package com.se.backend.mapper;

import com.se.backend.dto.response.ProductSummaryResponseForSeller;
import com.se.backend.entity.Product;
import com.se.backend.service.ProductService;
import com.se.backend.service.ReviewService;
import com.se.backend.service.storage.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
@Component
@RequiredArgsConstructor
public class ProductSummaryForSellerMapperImpl implements ProductSummaryForSellerMapper{
    private final ReviewService reviewService;
    private final ProductService productService;
    private final FileService fileService;
    public ProductSummaryResponseForSeller toProductSummaryForSeller(Product product) {
        if ( product == null ) {
            return null;
        }

        ProductSummaryResponseForSeller productSummary = new ProductSummaryResponseForSeller();
        productSummary.setProductId( product.getId() );
        productSummary.setName( product.getName() );
        productSummary.setRating( reviewService.ratingCalculator( product.getId() ) );
        productSummary.setMinPrice( productService.minPriceOf( product.getId() ) );
        productSummary.setShopName(product.getSeller().getShopName());
        String path = fileService.downloadFile(product.getProductImgs().getFirst()).getBody();
        productSummary.setFirstImage(path);
        productSummary.setStatus(product.getStatus());
        return productSummary;
    }


    public List<ProductSummaryResponseForSeller> toProductSummariesForSeller(List<Product> products) {
        if ( products == null ) {
            return null;
        }

        List<ProductSummaryResponseForSeller> list = new ArrayList<ProductSummaryResponseForSeller>( products.size() );
        for ( Product product : products ) {
            list.add(toProductSummaryForSeller(product));
        }

        return list;
    }
}
