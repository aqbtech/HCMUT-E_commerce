package com.se.backend.mapper;

import com.se.backend.dto.response.ProductSummary;
import com.se.backend.entity.CategoryPolicy;
import com.se.backend.entity.Product;
import com.se.backend.entity.ShopPolicy;
import com.se.backend.repository.CategoryPolicyRepository;
import com.se.backend.repository.ShopPolicyRepository;
import com.se.backend.service.ProductService;
import com.se.backend.service.ReviewService;
import com.se.backend.service.storage.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ProductSummaryMapperImpl implements ProductSummaryMapper {
	private final ReviewService reviewService;
	private final ProductService productService;
	private final FileService fileService;
	private final ShopPolicyRepository shopPolicyRepository;
	private final CategoryPolicyRepository categoryPolicyRepository;

	public ProductSummary toProductSummary(Product product) {
		if (product == null) {
			return null;
		}
		List<ShopPolicy> shopPolicy = shopPolicyRepository.findBySellerId(product.getSeller().getUsername());
		shopPolicy.sort(Comparator.comparing(ShopPolicy::getSale).reversed());
		List<CategoryPolicy> categoryPolicy = categoryPolicyRepository.findCategoryId(product.getCategory().getRichTextName());
		categoryPolicy.sort(Comparator.comparing(CategoryPolicy::getSale).reversed());
		Double shopSale = 0.0;
		Double cateSale = 0.0;
		for (ShopPolicy shop: shopPolicy){
			if(shop.getCount() > 0){
				shopSale = shop.getSale();
				break;
			}
		}
		for (CategoryPolicy cate: categoryPolicy){
			if(cate.getSale() > cateSale && cate.getCount() > 0 ){
				cateSale = cate.getSale();
				break;
			}
		}
		double totalSale = shopSale + cateSale;
		totalSale = totalSale > 1 ? 1 : totalSale;
		ProductSummary productSummary = new ProductSummary();
		productSummary.setSale(totalSale);
		productSummary.setProductId(product.getId());
		productSummary.setName(product.getName());
		productSummary.setRating(reviewService.ratingCalculator(product.getId()));
		productSummary.setMinPrice(productService.minPriceOf(product.getId()));
		String path = fileService.downloadFile(product.getProductImgs().getFirst()).getBody();
		productSummary.setFirstImage(path);
		return productSummary;
	}


	public List<ProductSummary> toProductSummaries(List<Product> products) {
		if (products == null) {
			return null;
		}

		List<ProductSummary> list = new ArrayList<>(products.size());
		for (Product product : products) {
			list.add(toProductSummary(product));
		}

		return list;
	}
}
