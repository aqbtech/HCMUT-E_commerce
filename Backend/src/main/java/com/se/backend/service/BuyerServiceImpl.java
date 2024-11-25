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

    public String updateBuyerInformation(String username,UpdateBuyerInformationRequest request){
        Buyer buyer = buyerRepository.findByUsername(username)
                .orElseThrow(()->new WebServerException(ErrorCode.USER_NOT_FOUND));
        try {
            buyer.setFirstName(request.getFirstName());
            buyer.setLastName(request.getLastName());
            buyer.setEmail(request.getEmail());
            buyer.setPhone(request.getPhone());
            buyer.setDob(request.getDOB());
        }
        catch (NullPointerException e){
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }
        try{
            buyerRepository.save(buyer);
        }
        catch (WebServerException e){
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }

        return "Your information is up to date";
    }
}
