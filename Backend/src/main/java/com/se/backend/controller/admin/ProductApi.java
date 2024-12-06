package com.se.backend.controller.admin;

import com.se.backend.dto.response.ProductSummaryResponseForSeller;
import com.se.backend.dto.response.ResponseAPITemplate;
import com.se.backend.entity.Product;
import com.se.backend.entity.Seller;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.mapper.ProductSummaryForSellerMapper;
import com.se.backend.repository.ProductRepository;
import com.se.backend.service.IProductManagementSerivce;
import com.se.backend.utils.PaginationUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/product")
@RequiredArgsConstructor
public class ProductApi {

    private final ProductRepository productRepository;
    private final ProductSummaryForSellerMapper productSummaryForSellerMapper;
    @GetMapping("/all-product")
    public ResponseAPITemplate<Page<ProductSummaryResponseForSeller>> getAllProductOfSeller(@RequestParam(value = "page", defaultValue = "0") int page) {
        Pageable pageable = PageRequest.of(page, 10, Sort.by("name").ascending());
        Page<Product> products = productRepository.findAll(pageable);
        List<Product> productsList = products.getContent();
        var response = productSummaryForSellerMapper.toProductSummariesForSeller(productsList);
        Page<ProductSummaryResponseForSeller> res = new PageImpl<>(response, pageable, products.getTotalElements());
        return ResponseAPITemplate.<Page<ProductSummaryResponseForSeller>>builder()
                .result(res)
                .build();
    }
}