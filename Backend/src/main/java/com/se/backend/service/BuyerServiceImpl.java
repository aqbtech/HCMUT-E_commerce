package com.se.backend.service;

import com.se.backend.dto.request.AddPaymentInfoRequest;
import com.se.backend.dto.request.UpdateBuyerInformationRequest;
import com.se.backend.dto.response.BuyerInformationResopnse;
import com.se.backend.dto.response.FollowResponse;
import com.se.backend.dto.response.PaymentInfoResponse;
import com.se.backend.entity.*;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.mapper.BuyerMapper;
import com.se.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BuyerServiceImpl implements BuyerService {
    @Autowired
    final private BuyerRepository buyerRepository;
    @Autowired
    final private BuyerMapper buyerMapper;
    @Autowired
    private final SellerRepository sellerRepository;
    @Autowired
    private final FollowRepository followRepository;
    @Autowired
    private final PaymentInfoRepository paymentInfoRepository;
    @Autowired
    private final BusinessRepository businessRepository;
    @Override
    public BuyerInformationResopnse getBuyerInformation(String username){
        Buyer buyer = buyerRepository.findByUsername(username)
                .orElseThrow(()->new WebServerException(ErrorCode.USER_NOT_FOUND));
        try{
            return buyerMapper.toBuyerInformationResponse(buyer);
        }
        catch(NullPointerException | WebServerException e){
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }
    }

    public String updateBuyerInformation(String username, UpdateBuyerInformationRequest request) {
        Buyer buyer = buyerRepository.findByUsername(username)
                .orElseThrow(() -> new WebServerException(ErrorCode.USER_NOT_FOUND));
        // Chỉ set các trường không null từ request
        if (request.getFirstName() != null) {
            buyer.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            buyer.setLastName(request.getLastName());
        }
        if (request.getEmail() != null) {
            buyer.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            buyer.setPhone(request.getPhone());
        }
        if (request.getDOB() != null) {
            buyer.setDob(request.getDOB());
        }
        try {
            buyerRepository.save(buyer);
        } catch (Exception e) {
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }

        return "Your information is up to date";
    }

    @Override
    public FollowResponse followSeller(String buyerUsername, String sellerUsername) {
        Buyer buyer = buyerRepository.findByUsername(buyerUsername)
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found"));
        Seller seller = sellerRepository.findByUsername(sellerUsername)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));
        FollowId followId = FollowId.builder()
                .followeeId(sellerUsername)
                .followerId(buyerUsername)
                .build();

        Follow follow = Follow.builder()
                .followee(seller)
                .follower(buyer)
                .followId(followId)
                .build();
        followRepository.save(follow);
        seller.setFollowers(seller.getFollowers() + 1);
        try {
            sellerRepository.save(seller);
        } catch (WebServerException e) {
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }
        return FollowResponse.builder()
                .msg("Follow success")
                .build();
    }

    @Override
    public FollowResponse unFollowSeller(String buyerUsername, String sellerUsername) {
        Buyer buyer = buyerRepository.findByUsername(buyerUsername)
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found"));
        Seller seller = sellerRepository.findByUsername(sellerUsername)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));
        FollowId followId = FollowId.builder()
                .followeeId(sellerUsername)
                .followerId(buyerUsername)
                .build();

        followRepository.delete(followRepository.findByFollowIdIs(followId));
        seller.setFollowers(seller.getFollowers() - 1);
        try {
            sellerRepository.save(seller);
        } catch (WebServerException e) {
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }
        return FollowResponse.builder()
                .msg("Unfollow success")
                .build();
    }

    @Override
    public PaymentInfoResponse addPaymentInfo(String username, AddPaymentInfoRequest addPaymentInfoRequest) {
        Buyer buyer = buyerRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found"));

        PaymentInfo paymentInfo = PaymentInfo.builder()
                .bankName(addPaymentInfoRequest.getBankName())
                .cardNumber(addPaymentInfoRequest.getSTK())
                .cardHolderName(addPaymentInfoRequest.getOwnerName())
                .business(buyer)
                .build();
        paymentInfoRepository.save(paymentInfo);
        return PaymentInfoResponse.builder()
                .msg("Add payment info success")
                .build();
    }

    @Override
    public PaymentInfoResponse deletePaymentInfo(String username, String STK) {
        Business business = businessRepository.findById(username)
                .orElseThrow(()->new IllegalArgumentException("Business not found"));
        paymentInfoRepository.delete(paymentInfoRepository.findPaymentInfoByBusinessAndCardNumber(business,STK));
        return PaymentInfoResponse.builder()
                .msg("Delete payment info success")
                .build();
    }
}
