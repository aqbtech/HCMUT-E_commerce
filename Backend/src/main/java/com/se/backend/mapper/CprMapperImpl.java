package com.se.backend.mapper;

import com.se.backend.dto.response.CartProduct;
import com.se.backend.dto.response.UserDeliveryInfo;
import com.se.backend.entity.Cart_ProductInstance;
import com.se.backend.entity.DeliveryInfor;
import com.se.backend.entity.Product;
import com.se.backend.repository.AttributeInsRepository;
import com.se.backend.service.ProductService;
import com.se.backend.utils.PaginationUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CprMapperImpl implements Cart_ProductInstanceMapper {
	private final ProductService productService;
	private final AttributeInsRepository attributeInsRepository;

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
		String productId = p.getId();
		String productInstanceId = cartProductInstance.getProductInstance().getId();
		String productName = p.getName();
		Long quantity = cartProductInstance.getQuantity();
		Double price = cartProductInstance.getProductInstance().getPrice();
		String imgUrl = null;
		List<String> listName = new ArrayList<>();
		p.getAttributes().forEach(attribute -> listName.add(attribute.getName()));
		List<String> listValue = new ArrayList<>();
		attributeInsRepository.findAttributeInstancesBy(cartProductInstance.getProductInstance()).forEach(attributeIns -> listValue.add(attributeIns.getValue()));

		return new CartProduct(productId, productInstanceId, productName, quantity, price, imgUrl, listName, listValue);
	}
}
