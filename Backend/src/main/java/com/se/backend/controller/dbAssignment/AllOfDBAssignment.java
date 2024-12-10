package com.se.backend.controller.dbAssignment;

import com.se.backend.dto.response.CartProduct;
import com.se.backend.dto.response.ProductSummary;
import com.se.backend.dto.response.ResponseAPITemplate;
import com.se.backend.dto.response.ShopInfoForGuestResponse;
import com.se.backend.entity.FileInfo;
import com.se.backend.repository.BuyerRepository;
import com.se.backend.service.storage.FileService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.GenericJDBCException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
public class AllOfDBAssignment {
	private final BuyerRepository buyerRepository;
	private final FileService fileService;
	@PersistenceContext
	private EntityManager em;

	public AllOfDBAssignment(BuyerRepository buyerRepository, FileService fileService) {
		this.buyerRepository = buyerRepository;
		this.fileService = fileService;
	}

	@PostMapping("/database/cart/add")
	public ResponseAPITemplate<?> addProductToCart(@AuthenticationPrincipal Jwt jwt,
														@RequestParam(value = "productInstanceId") String productInstanceId,
														@RequestParam(value = "quantity") Long quantity) {

			String username = jwt.getSubject();
			String buyerCartId = buyerRepository.findByUsername(username).get().getCart().getCartId().getCartId();
			StoredProcedureQuery query = em.createStoredProcedureQuery("AddProductToCart");
			query.registerStoredProcedureParameter("p_product_instance_id", String.class, ParameterMode.IN);
			query.registerStoredProcedureParameter("p_quantity", Integer.class, ParameterMode.IN);
			query.registerStoredProcedureParameter("p_buyer_cart_id", String.class, ParameterMode.IN);
			query.registerStoredProcedureParameter("p_buyer_id", String.class, ParameterMode.IN);

			query.setParameter("p_product_instance_id", productInstanceId);
			query.setParameter("p_quantity", quantity);
			query.setParameter("p_buyer_cart_id", buyerCartId);
			query.setParameter("p_buyer_id", username);
		try {
			query.execute();
			return ResponseAPITemplate.<String>builder()
					.result(null)
					.build();
		} catch (GenericJDBCException e) {
			return ResponseAPITemplate.<String>builder()
					.code(400)
					.message(e.getMessage())
					.result(null)
					.build();
		} catch (Exception e) {
			log.error("Server error when execute {}", query, e);
			return ResponseAPITemplate.builder()
					.code(500)
					.message("Internal server error")
					.build();
		}
	}

	@PostMapping("/database/cart/update")
	public ResponseAPITemplate<?> updateProductQuantityInCart(@AuthenticationPrincipal Jwt jwt,
																   @RequestParam(value = "productInstanceId") String productInstanceId,
																   @RequestParam(value = "quantity") Long quantity) {

			String username = jwt.getSubject();
			String buyerCartId = buyerRepository.findByUsername(username).get().getCart().getCartId().getCartId();
			StoredProcedureQuery query = em.createStoredProcedureQuery("UpdateProductQuantityInCart");
			query.registerStoredProcedureParameter("p_product_instance_id", String.class, ParameterMode.IN);
			query.registerStoredProcedureParameter("p_new_quantity", Long.class, ParameterMode.IN);
			query.registerStoredProcedureParameter("p_buyer_cart_id", String.class, ParameterMode.IN);
			query.registerStoredProcedureParameter("p_buyer_id", String.class, ParameterMode.IN);

			query.setParameter("p_product_instance_id", productInstanceId);
			query.setParameter("p_new_quantity", quantity);
			query.setParameter("p_buyer_cart_id", buyerCartId);
			query.setParameter("p_buyer_id", username);
		try {
			query.execute();
			return ResponseAPITemplate.<String>builder()
					.result(null)
					.build();
		} catch (GenericJDBCException e) {
			return ResponseAPITemplate.<String>builder()
					.code(400)
					.message(e.getMessage())
					.result(null)
					.build();
		} catch (Exception e) {
			log.error("Server error when execute {}", query, e);
			return ResponseAPITemplate.builder()
					.code(500)
					.message("Internal server error")
					.build();
		}
	}

	@DeleteMapping("/database/cart/delete")
	public ResponseAPITemplate<?> removeProductFromCart(@AuthenticationPrincipal Jwt jwt,
															 @RequestParam(value = "productInstanceId") String productInstanceId) {
		String username = jwt.getSubject();
		String buyerCartId = buyerRepository.findByUsername(username).get().getCart().getCartId().getCartId();
		StoredProcedureQuery query = em.createStoredProcedureQuery("RemoveProductFromCart");
		query.registerStoredProcedureParameter("p_product_instance_id", String.class, ParameterMode.IN);
		query.registerStoredProcedureParameter("p_buyer_cart_id", String.class, ParameterMode.IN);
		query.registerStoredProcedureParameter("p_buyer_id", String.class, ParameterMode.IN);

		query.setParameter("p_product_instance_id", productInstanceId);
		query.setParameter("p_buyer_cart_id", buyerCartId);
		query.setParameter("p_buyer_id", username);

		try {
			query.execute();
			return ResponseAPITemplate.<String>builder()
					.result(null)
					.build();
		} catch (GenericJDBCException e) {
			return ResponseAPITemplate.<String>builder()
					.code(400)
					.message(e.getMessage())
					.result(null)
					.build();
		} catch (Exception e) {
			log.error("Server error when execute {}", query, e);
			return ResponseAPITemplate.builder()
					.code(500)
					.message("Internal server error")
					.build();
		}
	}

	@GetMapping("/database/getDetailsCart")
	public ResponseAPITemplate<?> getCartDetails(@AuthenticationPrincipal Jwt jwt,
												 @RequestParam(value = "page", defaultValue = "0") int page,
												 @RequestParam(value = "size", defaultValue = "10") int size) {
		String username = jwt.getSubject();
		StoredProcedureQuery query = em.createStoredProcedureQuery("GetCartProductsSorted");
		query.registerStoredProcedureParameter("buyer_id", String.class, ParameterMode.IN);

		query.setParameter("buyer_id", username);

		try {
			@SuppressWarnings("unchecked")
			List<Object[]> result = query.getResultList();
			List<CartProduct> res = convertToListCartProduct(result);
			return ResponseAPITemplate.<List<CartProduct>>builder()
					.result(res)
					.build();
		} catch (GenericJDBCException e) {
			return ResponseAPITemplate.builder()
					.code(400)
					.message(e.getMessage())
					.build();
		} catch (Exception e) {
			log.error("Server error when execute {}", query, e);
			return ResponseAPITemplate.builder()
					.code(500)
					.message("Internal server error")
					.build();
		}
	}

	private List<CartProduct> convertToListCartProduct(List<Object[]> queryResultList) {
		List<CartProduct> res = new ArrayList<>();
		String prevProductInstanceId = null;
		for (Object[] objects : queryResultList) {
			if (!objects[1].toString().equals(prevProductInstanceId)) {
				prevProductInstanceId = objects[1].toString();
				CartProduct cp = CartProduct.builder()
						.productId(objects[0] != null ? objects[0].toString() : null)
						.productInstanceId(objects[1] != null ? objects[1].toString() : null)
						.productName(objects[2] != null ? objects[2].toString() : null)
						.quantity(objects[3] != null ? Long.parseLong(objects[3].toString()) : null)
						.listName(objects[4] != null ? new ArrayList<>(List.of(objects[4].toString())) : null)
						.listValue(objects[5] != null ? new ArrayList<>(List.of(objects[5].toString())) : null)
						.ShopName(objects[6] != null ? objects[6].toString() : null)
						.sellerId(objects[7] != null ? objects[7].toString() : null)
						.price(objects[8] != null ? Double.parseDouble(objects[8].toString()) : null)
						.sale(objects[11] != null ? Double.parseDouble(objects[11].toString()) : null)
						.imageUrl(objects[9] != null && objects[10] != null
								? fileService.downloadFile(new FileInfo(objects[9].toString(), objects[10].toString())).getBody()
								: null)
						.build();
				res.add(cp);
			} else {
				if (objects[4] != null && objects[5] != null) {
					List<String> lastName = res.getLast().getListName();
					List<String> lastValue = res.getLast().getListValue();
					lastName.add(objects[4].toString());
					lastValue.add(objects[5].toString());
					res.getLast().setListName(lastName);
					res.getLast().setListValue(lastValue);
				}
			}
		}
		return res;
	}

	@GetMapping("/database/shopInfo")
	public ResponseAPITemplate<?> countFollowers(@AuthenticationPrincipal Jwt jwt,
												 @RequestParam(value = "shopId") String shopId) {
		String username = jwt.getSubject();
		StoredProcedureQuery query = em.createStoredProcedureQuery("GetShopInformationWithFollowerCount");
		query.registerStoredProcedureParameter("buyername", String.class, ParameterMode.IN);
		query.registerStoredProcedureParameter("sellername", String.class, ParameterMode.IN);

		query.setParameter("sellername", shopId);
		query.setParameter("buyername", username);
		try {
			List<Object[]> q = query.getResultList();
			ShopInfoForGuestResponse res = convertShopInfoForGuestResponse(q);
			return ResponseAPITemplate.<ShopInfoForGuestResponse>builder()
					.result(res)
					.build();
		} catch (GenericJDBCException e) {
			return ResponseAPITemplate.<String>builder()
					.code(400)
					.message(e.getMessage())
					.result(null)
					.build();
		} catch (Exception e) {
			return ResponseAPITemplate.builder()
					.code(400)
					.message(e.getMessage())
					.build();
		}
	}

	private ShopInfoForGuestResponse convertShopInfoForGuestResponse(List<Object[]> queryResultList) {
		if (queryResultList.isEmpty()) {
			throw new RuntimeException("No result found");
		}
		Object[] firstRow = queryResultList.getFirst();
		return ShopInfoForGuestResponse.builder()
				.shopName(firstRow[0] != null ? firstRow[0].toString() : null)
				.rating(firstRow[1] != null ? Double.parseDouble(firstRow[1].toString()) : null)
				.numberOfProduct(firstRow[2] != null ? Integer.parseInt(firstRow[2].toString()) : 0)
				.followers(firstRow[3] != null ? Integer.parseInt(firstRow[3].toString()) : 0)
				.address(firstRow[4] != null ? firstRow[4].toString() : null)
				.isFollowed(firstRow[5] != null && firstRow[5].toString().equals("1"))
				.build();
	}

	@GetMapping("/database/getProductByCategory")
	public ResponseAPITemplate<?> getProductByCategory(@RequestParam(value = "categoryName") String categoryName) {
		StoredProcedureQuery query = em.createStoredProcedureQuery("GetProductsByCategoryWithAvgRating");
		query.registerStoredProcedureParameter("category_name", String.class, ParameterMode.IN);

		try {
			query.setParameter("category_name", categoryName);
			List<Object[]> queryResultList = query.getResultList();
			List<ProductSummary> res = convertToList(queryResultList);
			return ResponseAPITemplate.<List<ProductSummary>>builder()
					.result(res)
					.build();
		} catch (GenericJDBCException e) {
			return ResponseAPITemplate.<List<ProductSummary>>builder()
					.code(400)
					.message(e.getMessage())
					.result(null)
					.build();
		} catch (Exception e) {
			log.error("Server error when execute {}", query, e);
			return ResponseAPITemplate.builder()
					.code(500)
					.message("Internal server error")
					.build();
		}
	}

	private List<ProductSummary> convertToList(List<Object[]> queryResultList) {
		return queryResultList.stream()
				.map(obj -> ProductSummary.builder()
						.productId(obj[0] != null ? obj[0].toString() : null) // Assign productId
						.name(obj[1] != null ? obj[1].toString() : null)       // Assign name
						.rating(obj[2] != null ? Double.parseDouble(obj[2].toString()) : null) // Assign rating
						.minPrice(obj[3] != null ? Double.valueOf(obj[3].toString()) : null) // Assign minPrice
						.sale(obj[4] != null ? Double.valueOf(obj[4].toString()) : null)     // Assign sale
						.firstImage(obj[5] != null && obj[6] != null
								? fileService.downloadFile(new FileInfo(obj[5].toString(), obj[6].toString())).getBody()
								: null)               // Assign image
						.build())
				.toList();
	}
}
