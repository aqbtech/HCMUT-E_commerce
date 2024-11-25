package com.se.backend.service;

import com.se.backend.dto.request.UpdateShopInformationRequest;
import com.se.backend.dto.response.ShopInformationResponse;

public interface SellerService {
    ShopInformationResponse getShopInformation(String username);
    String updateShopInformation(String username, UpdateShopInformationRequest request);
}
