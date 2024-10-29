package com.se.backend.controller;

import com.se.backend.dto.request.ProductRequest;
import com.se.backend.dto.response.CUDResponse;
import com.se.backend.dto.response.ProductResponse;
import com.se.backend.dto.response.ResponseAPITemplate;
import com.se.backend.service.SellerFeature.impl.ProductManagementConcrete;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/seller")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true)
public class SellerController {

    @Autowired
    private ProductManagementConcrete productManagementConcrete;

    @PostMapping("/product/add")
    public ResponseAPITemplate<CUDResponse> addProduct(@RequestBody ProductRequest productRequest, @RequestParam String username) {
        return ResponseAPITemplate.<CUDResponse>builder()
                .result(productManagementConcrete.addProduct(productRequest, username))
                .build();
    }

    @PutMapping("/product/update")
    public ResponseAPITemplate<CUDResponse> updateProduct(@RequestBody ProductRequest productRequest, String username) {
        CUDResponse updateResponse = productManagementConcrete.updateProduct(productRequest, username);
        return ResponseAPITemplate.<CUDResponse>builder()
                .result(updateResponse)
                .build();
    }

    @DeleteMapping("/product/delete")
    public ResponseAPITemplate<CUDResponse> deleteProduct(@RequestParam String productId, @RequestParam String username) {
        CUDResponse deleteResponse = productManagementConcrete.deleteProduct(productId, username);
        return ResponseAPITemplate.<CUDResponse>builder()
                .result(deleteResponse)
                .build();
    }

    @GetMapping("/product/get")
    public ResponseAPITemplate<ProductResponse> getProductById(@RequestParam String productId) {
        return ResponseAPITemplate.<ProductResponse>builder()
                .result(productManagementConcrete.getProductById(productId))
                .build();
    }
}
