package com.se.backend.service.SellerFeature;

import com.se.backend.dto.request.ProductRequest;
import com.se.backend.dto.response.CUDResponse;
import com.se.backend.dto.response.ProductResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface IProductManagement {

    CUDResponse addProduct(ProductRequest productRequest, String username);

    CUDResponse updateProduct(ProductRequest productRequest, String username);

    CUDResponse deleteProduct(String productId, String username);

    ProductResponse getProductById(String productId);

    List<ProductResponse> getProductByCategory(String CategoryName);

    Iterable<ProductResponse> searchProduct(String Keyword);
}
