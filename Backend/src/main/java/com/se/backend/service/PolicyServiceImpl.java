package com.se.backend.service;

import com.se.backend.dto.request.AddPolicyRequest;
import com.se.backend.dto.request.UpdatePolicyRequest;
import com.se.backend.dto.response.CategoryResponse;
import com.se.backend.dto.response.PolicyResponse;
import com.se.backend.entity.*;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.mapper.CategoryMapper;
import com.se.backend.mapper.PolicyMapper;
import com.se.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowire;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class PolicyServiceImpl implements PolicyService{
    @Autowired
    private final PolicyMapper policyMapper;
    @Autowired
    private final ShopPolicyRepository shopPolicyRepository;
    @Autowired
    private final CategoryPolicyRepository categoryPolicyRepository;
    @Autowired
    private final AdminRepository adminRepository;
    @Autowired
    private final SellerRepository sellerRepository;
    @Autowired
    private final CategoryRepository categoryRepository;
    @Autowired
    private final PolicyRepository policyRepository;

    @Override
    @Transactional
    public String updatePolicy(String adminId, UpdatePolicyRequest request){
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new WebServerException(ErrorCode.USER_NOT_FOUND));
        String type = request.getType();
        List<String> targets = request.getTarget();

        if ("shop".equals(type)) {
            ShopPolicy shopPolicy = shopPolicyRepository.findById(request.getPolicyId())
                    .orElseThrow(() -> new WebServerException(ErrorCode.UNKNOWN_ERROR));

            // Cập nhật danh sách Admin
            List<Admin> adminList = shopPolicy.getAdmins();
            if (!adminList.contains(admin)) {
                adminList.add(admin);
                shopPolicy.setAdmins(adminList);
            }

            // Cập nhật danh sách Seller
            List<Seller> sellerList = shopPolicy.getSellers();
            for (String target : targets) {
                Seller seller = sellerRepository.findByUsername(target)
                        .orElseThrow(() -> new WebServerException(ErrorCode.USER_NOT_FOUND));
                if (!sellerList.contains(seller)) {
                    sellerList.add(seller);
                }
            }
            shopPolicy.setSellers(sellerList);

            // Chỉ cập nhật các trường không null
            if (request.getPolicy_description() != null) shopPolicy.setPolicyDescription(request.getPolicy_description());
            if (request.getPolicy_name() != null) shopPolicy.setPolicyName(request.getPolicy_name());
            if (request.getApply_date() != null) shopPolicy.setApplyDate(request.getApply_date());
            if (request.getCount() != 0) shopPolicy.setCount(request.getCount());
            if (request.getRelease_date() != null) shopPolicy.setReleaseDate(request.getRelease_date());
            if (request.getSale() != null) shopPolicy.setSale(request.getSale());

            try {
                policyRepository.save(shopPolicy);
            } catch (WebServerException e) {
                throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
            }
        } else if ("category".equals(type)) {
            List<Category> categoryList = new ArrayList<>();
            for (String target : targets) {
                Category category = categoryRepository.findCategoryById(Long.valueOf(target))
                        .orElseThrow(() -> new WebServerException(ErrorCode.UNKNOWN_ERROR));
                if (!categoryList.contains(category)) {
                    categoryList.add(category);
                }
            }

            // Tìm CategoryPolicy hiện tại hoặc tạo mới
            CategoryPolicy categoryPolicy = categoryPolicyRepository.findById(request.getPolicyId())
                    .orElse(CategoryPolicy.builder()
                            .admins(new ArrayList<>())
                            .categories(new ArrayList<>())
                            .build());

            // Cập nhật danh sách Admin
            List<Admin> adminList = categoryPolicy.getAdmins();
            if (!adminList.contains(admin)) {
                adminList.add(admin);
                categoryPolicy.setAdmins(adminList);
            }

            // Cập nhật danh sách Category
            categoryPolicy.setCategories(categoryList);

            // Chỉ cập nhật các trường không null
            if (request.getPolicy_description() != null) categoryPolicy.setPolicyDescription(request.getPolicy_description());
            if (request.getPolicy_name() != null) categoryPolicy.setPolicyName(request.getPolicy_name());
            if (request.getApply_date() != null) categoryPolicy.setApplyDate(request.getApply_date());
            if (request.getCount() != 0) categoryPolicy.setCount(request.getCount());
            if (request.getRelease_date() != null) categoryPolicy.setReleaseDate(request.getRelease_date());
            if (request.getSale() != null) categoryPolicy.setSale(request.getSale());

            try {
                policyRepository.save(categoryPolicy);
            } catch (WebServerException e) {
                throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
            }
        } else {
            return "Wrong type of policy";
        }
        return "Update successfully";
    }
    @Override
    @Transactional
    public String addPolicy(String adminId, List<String> targets, String type, AddPolicyRequest request){
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(()->new WebServerException(ErrorCode.USER_NOT_FOUND));
        List<Admin> adminList = List.of(admin);
        if("shop".equals(type)){
            List<Seller> sellerList = new ArrayList<>();
            for(String target : targets){
                Seller seller = sellerRepository.findByUsername(target)
                        .orElseThrow(()->new WebServerException(ErrorCode.USER_NOT_FOUND));
                if(seller.getStatus()) sellerList.add(seller);
            }

            ShopPolicy shopPolicy = ShopPolicy.builder()
                    .admins(adminList)
                    .sellers(sellerList)
                    .build();
            shopPolicy.setPolicyDescription(request.getPolicy_description());
            shopPolicy.setPolicyName(request.getPolicy_name());
            shopPolicy.setApplyDate(request.getApply_date());
            shopPolicy.setCount(request.getCount());
            shopPolicy.setReleaseDate(request.getRelease_date());
            shopPolicy.setSale(request.getSale());
            try {
                policyRepository.save(shopPolicy);
            }
            catch (WebServerException e){
                throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
            }
        }
        else if("category".equals(type)){
            List<Category> categoryList = new ArrayList<>();
            for(String target : targets){
                Category category = categoryRepository.findByRichTextName(target);
                categoryList.add(category);
            }

            CategoryPolicy categoryPolicy = CategoryPolicy.builder()
                    .admins(adminList)
                    .categories(categoryList)
                    .build();
            categoryPolicy.setPolicyDescription(request.getPolicy_description());
            categoryPolicy.setPolicyName(request.getPolicy_name());
            categoryPolicy.setApplyDate(request.getApply_date());
            categoryPolicy.setCount(request.getCount());
            categoryPolicy.setReleaseDate(request.getRelease_date());
            categoryPolicy.setSale(request.getSale());
            try {
                policyRepository.save(categoryPolicy);
            }
            catch (WebServerException e){
                throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
            }
        }
        else{
            return "Wrong type of policy";
        }
        return "Add successfully";
    }
    @Override
    public Page<PolicyResponse> getAllShopPolicy(int page){
        Pageable pageable = PageRequest.of(page, 10);
        Page<ShopPolicy> shopPolicyPage = shopPolicyRepository.findAll(pageable);
        List<ShopPolicy> shopPolicies = shopPolicyPage.getContent();
        List<PolicyResponse> responses = new ArrayList<>();
        for(ShopPolicy shopPolicy : shopPolicies){
            List<Seller> sellerList = shopPolicy.getSellers();
            List<String> target = new ArrayList<>();
            for(Seller seller : sellerList){
                target.add(seller.getUsername());
            }
            PolicyResponse r1 = policyMapper.toPolicyDetail(shopPolicy);
            r1.setTarget(target);
            r1.setType("shop");
            responses.add(r1);
        }
        return new PageImpl<>(
                responses,
                pageable,
                shopPolicyPage.getTotalElements()
        );
    }
    @Override
    public Page<PolicyResponse> getAllCategoryPolicy(int page){
        Pageable pageable = PageRequest.of(page, 10);
        Page<CategoryPolicy> catetgoryPolicyPage = categoryPolicyRepository.findAll(pageable);
        List<CategoryPolicy> categoryPolicies = catetgoryPolicyPage.getContent();
        List<PolicyResponse> responses = new ArrayList<>();
        for(CategoryPolicy catetgoryPolicy : categoryPolicies){
            List<Category> categoryList = catetgoryPolicy.getCategories();
            List<String> target = new ArrayList<>();
            for(Category category : categoryList){
                target.add(category.getRichTextName());
            }
            PolicyResponse r1 = policyMapper.toPolicyDetail(catetgoryPolicy);
            r1.setTarget(target);
            r1.setType("category");
            responses.add(r1);
        }
        return new PageImpl<>(
                responses,
                pageable,
                catetgoryPolicyPage.getTotalElements()
        );
    }
    @Override
    public String deletePolicy(String type, Long id){
        if("shop".equals(type)){
            ShopPolicy shopPolicy = shopPolicyRepository.findById(id)
                    .orElseThrow(()->new WebServerException(ErrorCode.UNKNOWN_ERROR));
            shopPolicyRepository.delete(shopPolicy);
        }
        else if("category".equals(type)){
            CategoryPolicy categoryPolicy = categoryPolicyRepository.findById(id)
                            .orElseThrow(()->new WebServerException(ErrorCode.UNKNOWN_ERROR));
            categoryPolicyRepository.delete(categoryPolicy);
        }
        else{
            return "Wrong type of policy";
        }
        return "Delete successfully";
    }
}
