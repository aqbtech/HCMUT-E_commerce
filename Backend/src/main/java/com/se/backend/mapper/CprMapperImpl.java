package com.se.backend.mapper;

import com.se.backend.dto.response.CartProduct;
import com.se.backend.dto.response.UserDeliveryInfo;
import com.se.backend.entity.*;
import com.se.backend.repository.AttributeInsRepository;
import com.se.backend.repository.CategoryPolicyRepository;
import com.se.backend.repository.FileInfoRepo;
import com.se.backend.repository.ShopPolicyRepository;
import com.se.backend.service.ProductService;
import com.se.backend.service.storage.FileService;
import com.se.backend.utils.PaginationUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CprMapperImpl implements Cart_ProductInstanceMapper {
	private final ProductService productService;
	private final AttributeInsRepository attributeInsRepository;
	private final FileInfoRepo fileInfoRepo;
	private final FileService fileService;
	private final ShopPolicyRepository shopPolicyRepository;
	private final CategoryPolicyRepository categoryPolicyRepository;

	@Override
	public List<CartProduct> toFlashProductList(List<Cart_ProductInstance> cartList) {
		if ( cartList == null ) {
			return null;
		}
		List<CartProduct> list = new ArrayList<>( cartList.size() );
		for ( Cart_ProductInstance cartProductInstance : cartList ) {
			list.add( toCartProduct( cartProductInstance ) );
		}
		return list;
	}

	@Override
	public CartProduct toCartProduct(Cart_ProductInstance cartProductInstance) {
		if ( cartProductInstance == null ) {
			return null;
		}
		Product p = productService.findByProductInstance(cartProductInstance.getProductInstance());
		List<ShopPolicy> shopPolicy = shopPolicyRepository.findBySellerId(p.getSeller().getUsername());
		shopPolicy.sort(Comparator.comparing(ShopPolicy::getSale).reversed());
		List<CategoryPolicy> categoryPolicy = categoryPolicyRepository.findCategoryId(p.getCategory().getRichTextName());
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

		String productId = p.getId();
		String productInstanceId = cartProductInstance.getProductInstance().getId();
		String productName = p.getName();
		Long quantity = cartProductInstance.getQuantity();
		Double price = cartProductInstance.getProductInstance().getPrice();
		FileInfo fileInfo = fileInfoRepo.findFileInfoByProduct(p).getFirst();
		String imgUrl = fileService.downloadFile(fileInfo).getBody();
		String sellerId = p.getSeller().getUsername();
		String shopName = p.getSeller().getShopName();
		List<String> listName = new ArrayList<>();
		p.getAttributes().forEach(attribute -> listName.add(attribute.getName()));
		List<String> listValue = new ArrayList<>();
		attributeInsRepository.findAttributeInstancesBy(cartProductInstance.getProductInstance()).forEach(attributeIns -> listValue.add(attributeIns.getValue()));

		return new CartProduct(productId, productInstanceId, productName, quantity, price, imgUrl, listName, listValue, sellerId, shopName, totalSale);
	}
}
