package com.se.backend.service;

import com.se.backend.dto.request.AddPaymentInfoRequest;
import com.se.backend.dto.request.UpdateBuyerInformationRequest;
import com.se.backend.dto.response.BuyerInformationResopnse;
import com.se.backend.dto.response.FollowResponse;
import com.se.backend.dto.response.PaymentInfoResponse;

public interface BuyerService {
    BuyerInformationResopnse getBuyerInformation(String username);
    String updateBuyerInformation(String username, UpdateBuyerInformationRequest request);
    FollowResponse followSeller(String buyerUsername, String sellerUsername);
    FollowResponse unFollowSeller(String buyerUsername, String sellerUsername);

    PaymentInfoResponse addPaymentInfo(String username, AddPaymentInfoRequest addPaymentInfoRequest);
    PaymentInfoResponse deletePaymentInfo(String username, String STK);
}
