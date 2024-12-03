package com.se.backend.service;

import com.se.backend.dto.request.AddProductToShopRequest;
import com.se.backend.dto.request.UpdateProductRequest;
import com.se.backend.dto.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface IProductManagementSerivce {
    AddProductToShopResponse addProductToShop(AddProductToShopRequest addProductToShopRequest);
    UpdateProductInShopResponse updateProductInShop(UpdateProductRequest updateProductRequest);
    Page<ProductSummaryResponseForSeller> getAllProduct(String username, int page);

    ChangeStatusOfProduct enabledProduct(String productId);
    ChangeStatusOfProduct disabledProduct(String productId);
    GetDetailProductResponse getDetailProduct(String productId);
}
