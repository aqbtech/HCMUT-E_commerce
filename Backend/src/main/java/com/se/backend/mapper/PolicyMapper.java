package com.se.backend.mapper;

import com.se.backend.dto.response.PolicyResponse;
import com.se.backend.dto.response.ProductDetail;
import com.se.backend.entity.CategoryPolicy;
import com.se.backend.entity.Policy;
import com.se.backend.entity.Product;
import com.se.backend.entity.ShopPolicy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PolicyMapper {
    @Mapping(target = "policyId", source = "policyId")
    @Mapping(target = "apply_date", source = "applyDate")
    @Mapping(target = "policy_description", source = "policyDescription")
    @Mapping(target = "policy_name", source = "policyName")
    @Mapping(target = "release_date", source = "releaseDate")
    @Mapping(target = "sale", source = "sale")
    @Mapping(target = "count", source = "count")
    PolicyResponse toPolicyDetail(ShopPolicy policy);

    @Mapping(target = "policyId", source = "policyId")
    @Mapping(target = "apply_date", source = "applyDate")
    @Mapping(target = "policy_description", source = "policyDescription")
    @Mapping(target = "policy_name", source = "policyName")
    @Mapping(target = "release_date", source = "releaseDate")
    @Mapping(target = "sale", source = "sale")
    @Mapping(target = "count", source = "count")
    PolicyResponse toPolicyDetail(CategoryPolicy policy);
}
