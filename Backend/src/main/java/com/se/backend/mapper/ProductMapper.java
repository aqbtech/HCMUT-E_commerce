package com.se.backend.mapper;
import com.se.backend.dto.response.ProductResponse;
import com.se.backend.dto.request.ProductRequest;
import com.se.backend.entity.*;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;


@Component

public class ProductMapper {
    public Product toProduct(ProductRequest productRequest) {
        Product product = new Product();

        product.setId(UUID.randomUUID().toString());
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());

        Category category = new Category();
        category.setName(productRequest.getCategoryName());
        product.setCategory(category);

        Seller seller = new Seller();
        seller.setUsername(productRequest.getSellerUsername());
        product.setSeller(seller);

        if (productRequest.getAttribute() != null) {
            List<Attribute> attributes = productRequest.getAttribute().stream().map(attribute -> {
                Attribute newAttribute = new Attribute();
                newAttribute.setName(attribute.getName());
                return newAttribute;
            }).collect(Collectors.toList());
            product.setAttributes(attributes);
        }

        if (productRequest.getBuildProduct() != null) {
            BuildProduct buildProduct = new BuildProduct();
            buildProduct.setProduct(product);
            product.setBuildProduct(buildProduct);
        }

        if (productRequest.getAdmin() != null) {
            List<Admin> admins = productRequest.getAdmin().stream().map(admin -> {
                Admin newAdmin = new Admin();
                newAdmin.setUsername(admin.getUsername());
                return newAdmin;
            }).collect(Collectors.toList());
            product.setAdmins(admins);
        }

        return product;
    }

    public ProductResponse toProductResponse(Product product) {
        ProductResponse productResponse = new ProductResponse();

        productResponse.setId(product.getId());
        productResponse.setName(product.getName());
        productResponse.setDescription(product.getDescription());

        if (product.getCategory() != null) {
            productResponse.setCategoryName(product.getCategory().getName());
        }

        if (product.getAttributes() != null) {
            List<Admin> attributes = product.getAttributes().stream()
                    .map(attribute -> {
                        Admin admin = new Admin();
                        admin.setUsername(attribute.getName());
                        return admin;
                    })
                    .collect(Collectors.toList());
            productResponse.setAttributes(attributes);
        }

        if (product.getSeller() != null) {
            productResponse.setSellerName(product.getSeller().getUsername());
        }

        if (product.getAdmins() != null) {
            List<Admin> adminNames = product.getAdmins().stream()
                    .map(admin -> {
                        Admin newAdmin = new Admin();
                        newAdmin.setUsername(admin.getUsername());
                        return newAdmin;
                    })
                    .collect(Collectors.toList());
            productResponse.setAdminNames(adminNames);
        }

        return productResponse;
    }
}
