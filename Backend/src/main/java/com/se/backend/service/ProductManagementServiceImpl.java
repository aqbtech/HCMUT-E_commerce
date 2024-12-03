package com.se.backend.service;

import com.se.backend.dto.request.AddProductToShopRequest;
import com.se.backend.dto.request.UpdateProductRequest;
import com.se.backend.dto.response.*;
import com.se.backend.entity.*;
import com.se.backend.mapper.ProductSummaryForSellerMapper;
import com.se.backend.repository.*;
import com.se.backend.utils.PaginationUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;



@Service
@Slf4j
@RequiredArgsConstructor
public class ProductManagementServiceImpl implements IProductManagementSerivce {
    @Autowired
    private SellerRepository sellerRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private AttributeRepository attributeRepository;
    @Autowired
    private AttributeInsRepository attributeInsRepository;
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private BuildProductRepository buildProductRepository;
    @Autowired
    private ProductInstanceRepository productInstanceRepository;
    private final ProductSummaryForSellerMapper productSummaryForSellerMapper;

    @Override
    public AddProductToShopResponse addProductToShop(AddProductToShopRequest addProductToShopRequest) {
        for(int i = 0 ; i < addProductToShopRequest.getProductInstances().size(); i++ ){
            if(addProductToShopRequest.getProductInstances().get(i).getPrice()<= 0)
                throw new IllegalArgumentException("Price must be greater than 0");
            if (addProductToShopRequest.getProductInstances().get(i).getQuantityInStock() <= 0)
                throw new IllegalArgumentException("QuantityInStock must be greater than 0");
        }
        Seller seller = sellerRepository.findByUsername(addProductToShopRequest.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));

        Category category = categoryRepository.findByRichTextName(addProductToShopRequest.getCategory());

        List<Admin> admins = adminRepository.findAll();

        Product product = Product.builder()
                .name(addProductToShopRequest.getName())
                .description(addProductToShopRequest.getDescription())
                .seller(seller)
                .category(category)
                .status("ENABLED")
                .admins(admins)
                .build();

        productRepository.save(product);

        if(!addProductToShopRequest.getAttributes().isEmpty()) {
            List<Attribute> attributes = new ArrayList<>();
            for (AddProductToShopRequest.AttributeRequest attrReq : addProductToShopRequest.getAttributes()) {
                Attribute attribute = Attribute.builder()
                        .name(attrReq.getName())
                        .ofProduct(product)
                        .attributeInstances(new ArrayList<>())
                        .build();
                attributeRepository.save(attribute);
                for (String value : attrReq.getValues()) {
                    AttributeInstance attributeInstance = AttributeInstance.builder()
                            .attribute(attribute)
                            .attributeInstanceId(new AttributeInstanceId(attribute.getId(), UUID.randomUUID().toString()))  // Tạo ID ngẫu nhiên cho attributeInstance
                            .value(value)
                            .build();
                    attributeInsRepository.save(attributeInstance);
                    attribute.getAttributeInstances().add(attributeInstance);

                }
                attributes.add(attribute);
                attributeRepository.save(attribute);
            }
            product.setAttributes(attributes);

            List<ProductInstance> productInstanceList = new ArrayList<>();
            for (int i = 0; i < addProductToShopRequest.getProductInstances().size(); i++) {
                AddProductToShopRequest.ProductInstanceRequest instanceReq = addProductToShopRequest.getProductInstances().get(i);
                ProductInstance productInstance = ProductInstance.builder()
                        .price(instanceReq.getPrice())
                        .quantityInStock(instanceReq.getQuantityInStock())
                        .build();
                productInstanceList.add(productInstance);
                productInstanceRepository.save(productInstance);
            }

            List<AttributeInstance> attInst = new ArrayList<>();
            for (int i = 0; i < addProductToShopRequest.getProductInstances().size(); i++) {
                for (int j = 0; j < addProductToShopRequest.getProductInstances().get(i).getAttributeValues().size(); j++) {
                    String temp = addProductToShopRequest.getProductInstances().get(i).getAttributeValues().get(j);
                    for (int k = 0; k < attributes.get(j).getAttributeInstances().size(); k++) {
                        if (temp.equals(attributes.get(j).getAttributeInstances().get(k).getValue())) {
                            attInst.add(attributes.get(j).getAttributeInstances().get(k));
                            break;
                        }
                    }
                }
            }

            for (int i = 0; i < addProductToShopRequest.getProductInstances().size(); i++) {
                for (int j = 0; j < addProductToShopRequest.getProductInstances().get(i).getAttributeValues().size(); j++) {
                    int idx = i * addProductToShopRequest.getProductInstances().get(i).getAttributeValues().size() + j;
                    AttributeInstance tmp1 = attInst.get(idx);
                    ProductInstance tmp2 = productInstanceList.get(i);
                    BuildProduct buildProduct = BuildProduct.builder()
                            .id(new BuildProductId(product.getId(), tmp1.getAttributeInstanceId(), tmp2.getId()))
                            .product(product)
                            .attributeInstance(tmp1)
                            .productInstance(tmp2)
                            .build();
                    buildProductRepository.save(buildProduct);
                }

            }
        }
        else {

            Attribute attribute = Attribute.builder()
                    .ofProduct(product)
                    .attributeInstances(new ArrayList<>())
                    .build();
            attributeRepository.save(attribute);


            AttributeInstance attributeInstance = AttributeInstance.builder()
                    .attribute(attribute)
                    .attributeInstanceId(new AttributeInstanceId(attribute.getId(), UUID.randomUUID().toString()))
                    .build();
            attributeInsRepository.save(attributeInstance);


            ProductInstance productInstance = ProductInstance.builder()
                    .price(addProductToShopRequest.getProductInstances().getFirst().getPrice())
                    .quantityInStock(addProductToShopRequest.getProductInstances().getFirst().getQuantityInStock())
                    .build();
            productInstanceRepository.save(productInstance);


            BuildProduct buildProduct = BuildProduct.builder()
                    .id(new BuildProductId(product.getId(), attributeInstance.getAttributeInstanceId(), productInstance.getId()))
                    .product(product)
                    .attributeInstance(attributeInstance)
                    .productInstance(productInstance)
                    .build();
            buildProductRepository.save(buildProduct);
        }
        return AddProductToShopResponse.builder()
                .msg("Product is added successfully!")
                .build();
    }

    @Override
    public UpdateProductInShopResponse updateProductInShop(UpdateProductRequest updateProductRequest) {
        Seller seller = sellerRepository.findByUsername(updateProductRequest.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));
        Product updatedProduct = productRepository.findBasicProductById(updateProductRequest.getProductId());
        if(!updatedProduct.getName().equals(updateProductRequest.getName())){
            updatedProduct.setName(updateProductRequest.getName());
            productRepository.save(updatedProduct);
        }

        if(!updatedProduct.getDescription().equals(updateProductRequest.getDescription())){
            updatedProduct.setDescription(updateProductRequest.getDescription());
            productRepository.save(updatedProduct);
        }

        if(!updatedProduct.getCategory().getRichTextName().equals(updateProductRequest.getCategory())){
            updatedProduct.setCategory(categoryRepository.findByRichTextName(updateProductRequest.getCategory()));
            productRepository.save(updatedProduct);
        }

        for(int i = 0 ; i < updateProductRequest.getProductInstances().size(); i++){
            List<String> value1 = updateProductRequest.getProductInstances().get(i).getAttributeValues();
            List<Integer> idx = new ArrayList<>();
            for (int j = 0; j < updatedProduct.getBuildProduct().size(); j++){
                if(value1.contains(updatedProduct.getBuildProduct().get(j).getAttributeInstance().getValue())) {
                    idx.add(j);
                }
            }


            for(int k = 0 ; k < idx.size(); k++){
                List<Integer> index = new ArrayList<>();
                String id = updatedProduct.getBuildProduct().get(idx.get(k)).getProductInstance().getId();
                for (int t = 0; t < idx.size(); t++){
                    if(id.equals(updatedProduct.getBuildProduct().get(idx.get(t)).getProductInstance().getId())){
                        index.add(idx.get(t));
                    }
                }
                if(index.size() == updateProductRequest.getProductInstances().get(i).getAttributeValues().size()){
                    updatedProduct.getBuildProduct().get(index.getFirst()).getProductInstance().setPrice(updateProductRequest.getProductInstances().get(i).getPrice());
                    updatedProduct.getBuildProduct().get(index.getFirst()).getProductInstance().setQuantityInStock(updateProductRequest.getProductInstances().get(i).getQuantityInStock());
                    productInstanceRepository.save(updatedProduct.getBuildProduct().get(index.getFirst()).getProductInstance());
                    productRepository.save(updatedProduct);
                    break;
                }
            }
        }
        return UpdateProductInShopResponse.builder()
                .msg("Product is updated successfully!")
                .build();
    }

    @Override
    public Page<ProductSummaryResponseForSeller> getAllProduct(String username, int page) {
        Pageable pageable = PageRequest.of(page, 10, Sort.by("name").ascending());
        List<Product> products = productRepository.findBySeller_Username(username);
        Page<Product> prds = PaginationUtils.convertListToPage(products, pageable);
        List<Product> productsList = prds.getContent();
        return PaginationUtils.convertListToPage(productSummaryForSellerMapper.toProductSummariesForSeller(productsList), pageable);
    }

    @Override
    public ChangeStatusOfProduct enabledProduct(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        product.setStatus("ENABLED");
        productRepository.save(product);
        return ChangeStatusOfProduct.builder()
                .msg("Product is enabled!")
                .build();
    }

    @Override
    public ChangeStatusOfProduct disabledProduct(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        product.setStatus("DISABLED");
        productRepository.save(product);
        return ChangeStatusOfProduct.builder()
                .msg("Product is disabled!")
                .build();
    }

    @Override
    public GetDetailProductResponse getDetailProduct(String productId) {
        Product product = productRepository.findBasicProductById(productId);
        GetDetailProductResponse getDetailProductResponse = GetDetailProductResponse.builder()
                .productId(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .category(product.getCategory().getRichTextName())
                .build();



        // cho nay dang bug ne
        List<GetDetailProductResponse.AttributeRequest> attributeRequestList = new ArrayList<>();
        for(int i = 0; i < product.getBuildProduct().size(); i++){
            if(attributeRequestList.isEmpty()) {
                GetDetailProductResponse.AttributeRequest attributeRequest = new GetDetailProductResponse.AttributeRequest();
                attributeRequestList.add(attributeRequest);
                attributeRequestList.getFirst().setName(product.getBuildProduct().getFirst().getAttributeInstance().getAttribute().getName());
                int length = product.getBuildProduct().getFirst().getAttributeInstance().getAttribute().getAttributeInstances().size();
                List<String> tmp1 = new ArrayList<>();
                for(int j = 0 ; j < length; j++){
                    tmp1.add(product.getBuildProduct().getFirst().getAttributeInstance().getAttribute().getAttributeInstances().get(j).getValue());
                }
                attributeRequestList.getFirst().setValues(tmp1);
            }
            else{
                boolean isDuplicate = false;
                for(int k = 0; k < attributeRequestList.size(); k++){
                    if(Objects.equals(product.getBuildProduct().get(i).getAttributeInstance().getAttribute().getName(), attributeRequestList.get(k).getName())){
                        isDuplicate = true;
                        break;
                    }
                }

                if(!isDuplicate){
                    GetDetailProductResponse.AttributeRequest attributeRequest = new GetDetailProductResponse.AttributeRequest();
                    attributeRequestList.add(attributeRequest);
                    attributeRequestList.getLast().setName(product.getBuildProduct().get(i).getAttributeInstance().getAttribute().getName());
                    int length = product.getBuildProduct().get(i).getAttributeInstance().getAttribute().getAttributeInstances().size();
                    List<String> tmp2 = new ArrayList<>();
                    for(int j = 0 ; j < length; j++){
                        tmp2.add(product.getBuildProduct().get(i).getAttributeInstance().getAttribute().getAttributeInstances().get(j).getValue());
                    }
                    attributeRequestList.getLast().setValues(tmp2);
                }

            }
        }

        getDetailProductResponse.setAttributes(attributeRequestList);

        List<GetDetailProductResponse.ProductInstanceRequest> productInstanceRequestList = new ArrayList<>();
        for (int i = 0; i < product.getBuildProduct().size(); i++) {
            GetDetailProductResponse.ProductInstanceRequest productInstanceRequest = new GetDetailProductResponse.ProductInstanceRequest();
            String id = product.getBuildProduct().get(i).getProductInstance().getId();
            List<String> tmp = new ArrayList<>();
            tmp.add(product.getBuildProduct().get(i).getAttributeInstance().getValue());
            for (int j = i + 1; j < product.getBuildProduct().size(); j++){
                if(Objects.equals(product.getBuildProduct().get(j).getProductInstance().getId(), id)){
                    tmp.add(product.getBuildProduct().get(j).getAttributeInstance().getValue());
                }
            }
            if(tmp.size() == attributeRequestList.size()){
                productInstanceRequest.setAttributeValues(tmp);
                productInstanceRequest.setPrice(product.getBuildProduct().get(i).getProductInstance().getPrice());
                productInstanceRequest.setQuantityInStock(product.getBuildProduct().get(i).getProductInstance().getQuantityInStock());
                productInstanceRequestList.add(productInstanceRequest);
            }
        }
        getDetailProductResponse.setProductInstances(productInstanceRequestList);
        return  getDetailProductResponse;
    }
}
