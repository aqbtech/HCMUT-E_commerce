package com.se.backend.service.SellerFeature.impl;

import com.se.backend.dto.request.ProductRequest;
import com.se.backend.dto.response.CUDResponse;
import com.se.backend.dto.response.ProductResponse;
import com.se.backend.entity.*;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.mapper.ProductMapper;
import com.se.backend.repository.*;
import com.se.backend.service.SellerFeature.IProductManagement;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.jpa.JpaObjectRetrievalFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(makeFinal = true)
public class ProductManagementConcrete implements IProductManagement {
    @Autowired
    private CategoryRepository categoryRepository;
//    @Autowired
//    private AdminRepository adminRepository;
//    @Autowired
//    private AttributeRepository attributeRepository;
    @Autowired
    private SellerRepository sellerRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductMapper  productMapper;


    @Transactional
    @Override
    public CUDResponse addProduct(ProductRequest productRequest, String username) {
        try {
            Seller seller = sellerRepository.findByUsername(username);
            if (seller == null) {
                throw new WebServerException(ErrorCode.USER_NOT_FOUND);
            }
            Product product = productMapper.toProduct(productRequest);
            product.setSeller(seller);
            seller.getProduct().add(product);

            if (productRequest.getCategoryName() != null) {
                Category category = categoryRepository.findByName(productRequest.getCategoryName());
                if(category == null){
                    throw new WebServerException(ErrorCode.CATEGORY_NOT_FOUND);
                }
                product.setCategory(category);
            }

            if (!productRequest.getAttribute().isEmpty()) {
                product.setAttributes(productRequest.getAttribute());
            }

            if (productRequest.getBuildProduct()!= null) {
                BuildProduct buildProduct = productRequest.getBuildProduct();
                buildProduct.setProduct(product);
                product.setBuildProduct(buildProduct);
            }

            if (!productRequest.getAdmin().isEmpty()) {
                product.setAdmins(productRequest.getAdmin());
            }

            sellerRepository.save(seller);
            CUDResponse createResponse = new CUDResponse("Product has been added successfully");
            return createResponse;
        }
        catch (Exception e){
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }
    }

    @Transactional
    @Override
    public CUDResponse updateProduct(ProductRequest productRequest, String username) {
        try {
            Seller seller = sellerRepository.findByUsername(username);
            if (seller == null) {
                throw new WebServerException(ErrorCode.USER_NOT_FOUND);
            }

            Product product = productRepository.findById(productRequest.getId())
                    .orElseThrow(() -> new WebServerException(ErrorCode.PRODUCT_NOT_FOUND));

            if (!product.getSeller().getUsername().equals(username)) {
                throw new WebServerException(ErrorCode.UNAUTHORIZED);
            }

            if (productRequest.getName() != null && !productRequest.getName().equals(product.getName())) {
                product.setName(productRequest.getName());
            }
            if (productRequest.getDescription() != null && !productRequest.getDescription().equals(product.getDescription())) {
                product.setDescription(productRequest.getDescription());
            }

            if (productRequest.getCategoryName() != null) {
                Category category = new Category();
                category.setName(productRequest.getCategoryName());
                product.setCategory(category);
            }

            if (productRequest.getAttribute() != null) {
                List<Attribute> attributes = productRequest.getAttribute().stream()
                        .map(attr -> {
                            Attribute newAttribute = new Attribute();
                            newAttribute.setName(attr.getName());
                            return newAttribute;
                        })
                        .collect(Collectors.toList());
                product.setAttributes(attributes);
            }

            if (productRequest.getBuildProduct() != null) {
                BuildProduct buildProduct = new BuildProduct();
                buildProduct.setProduct(product);
                product.setBuildProduct(buildProduct);
            }

            if (productRequest.getAdmin() != null) {
                List<Admin> admins = productRequest.getAdmin().stream()
                        .map(admin -> {
                            Admin newAdmin = new Admin();
                            newAdmin.setUsername(admin.getUsername());
                            return newAdmin;
                        })
                        .collect(Collectors.toList());
                product.setAdmins(admins);
            }

            productRepository.save(product);

            CUDResponse cudResponse = new CUDResponse("Product has been updated successfully");
            return cudResponse;
        } catch (Exception e) {
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }
    }

    @Transactional
    @Override
    public CUDResponse deleteProduct(String productId, String username) {
        try{
            Seller seller = sellerRepository.findByUsername(username);
            if (seller == null) {
                throw new WebServerException(ErrorCode.USER_NOT_FOUND);
            }
            Product productToRemove = productRepository.findById(productId)
                    .orElseThrow(() -> new WebServerException(ErrorCode.PRODUCT_NOT_FOUND));

            if (!(seller.getProduct().contains(productToRemove))) {
                throw new WebServerException(ErrorCode.PRODUCT_NOT_BELONG_TO_SELLER);
            }
            seller.getProduct().remove(productToRemove);
            sellerRepository.save(seller);
            productRepository.delete(productToRemove);
            CUDResponse deleteResponse = new CUDResponse("Product has been deleted successfully");
            return deleteResponse;

        } catch (Exception e) {
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }
    }
    @Transactional
    @Override
    public ProductResponse getProductById(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new WebServerException(ErrorCode.PRODUCT_NOT_FOUND));
        return productMapper.toProductResponse(product);
    }
    @Transactional
    @Override
    public List<ProductResponse> getProductByCategory(String CategoryName) {
        return null;
    }
    @Transactional
    @Override
    public Iterable<ProductResponse> searchProduct(String Keyword) {
        return null;
    }

}
