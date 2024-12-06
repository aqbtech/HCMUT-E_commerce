package com.se.backend.service;

import com.se.backend.dto.request.AddPolicyRequest;
import com.se.backend.dto.request.UpdatePolicyRequest;
import com.se.backend.dto.response.PolicyResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface PolicyService {
    Page<PolicyResponse> getAllShopPolicy(int page);
    Page<PolicyResponse> getAllCategoryPolicy(int page);
    String addPolicy(String adminId, List<String> target, String type, AddPolicyRequest request);
    String updatePolicy(String adminId, UpdatePolicyRequest request);
    String deletePolicy(String type, Long id);

}
