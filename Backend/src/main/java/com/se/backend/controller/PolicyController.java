package com.se.backend.controller;

import com.se.backend.dto.request.AddPolicyRequest;
import com.se.backend.dto.request.UpdatePolicyRequest;
import com.se.backend.dto.response.PolicyResponse;
import com.se.backend.dto.response.ResponseAPITemplate;
import com.se.backend.service.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/policy")
public class PolicyController {
    @Autowired
    private final PolicyService policyService;
    @PostMapping("/add")
    public ResponseAPITemplate<String> addPolicy(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody AddPolicyRequest request){
        String res = policyService.addPolicy(jwt.getSubject(),request.getTarget(), request.getType(), request);
        return ResponseAPITemplate.<String>builder()
                .result(res)
                .build();
    }

    @PutMapping("/update")
    public ResponseAPITemplate<String> updatePolicy(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody UpdatePolicyRequest request){
        String res = policyService.updatePolicy(jwt.getSubject(), request);
        return ResponseAPITemplate.<String>builder()
                .result(res)
                .build();
    }
    @GetMapping("/get_shopPolicy")
    public ResponseAPITemplate<Page<PolicyResponse>> getShopPolicy(
            @RequestParam(value = "page", defaultValue = "0") int page
    ){
        Page<PolicyResponse> policyResponses = policyService.getAllShopPolicy(page);
        return ResponseAPITemplate.<Page<PolicyResponse>>builder()
                .result(policyResponses)
                .build();
    }
    @GetMapping("/get_categoryPolicy")
    public ResponseAPITemplate<Page<PolicyResponse>> getCategoryPolicy(
            @RequestParam(value = "page", defaultValue = "0") int page
    ){
        Page<PolicyResponse> policyResponses = policyService.getAllCategoryPolicy(page);
        return ResponseAPITemplate.<Page<PolicyResponse>>builder()
                .result(policyResponses)
                .build();
    }

    @DeleteMapping("/delete")
    public ResponseAPITemplate<String> deletePoolicy(
            @RequestParam(value = "type") String type,
            @RequestParam(value = "policyId") Long id
    ){
        String res = policyService.deletePolicy(type, id);
        return ResponseAPITemplate.<String>builder()
                .result(res)
                .build();

    }
}
