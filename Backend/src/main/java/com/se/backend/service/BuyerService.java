package com.se.backend.service;

import com.se.backend.dto.request.UpdateBuyerInformationRequest;
import com.se.backend.dto.response.BuyerInformationResopnse;

public interface BuyerService {
    BuyerInformationResopnse getBuyerInformation(String username);
    String updateBuyerInformation(String username, UpdateBuyerInformationRequest request);
}
