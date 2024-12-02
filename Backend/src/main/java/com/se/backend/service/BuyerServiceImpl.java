package com.se.backend.service;

import com.se.backend.dto.request.UpdateBuyerInformationRequest;
import com.se.backend.dto.response.BuyerInformationResopnse;
import com.se.backend.entity.Buyer;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.mapper.BuyerMapper;
import com.se.backend.repository.BuyerRepository;
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
        else if (request.getLastName() != null) {
            buyer.setLastName(request.getLastName());
        }
        else if (request.getEmail() != null) {
            buyer.setEmail(request.getEmail());
        }
        else if (request.getPhone() != null) {
            buyer.setPhone(request.getPhone());
        }
        else if (request.getDOB() != null) {
            buyer.setDob(request.getDOB());
        }
        try {
            buyerRepository.save(buyer);
        } catch (Exception e) {
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }

        return "Your information is up to date";
    }
}
