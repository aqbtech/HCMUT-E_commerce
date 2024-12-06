package com.se.backend.service;

import com.se.backend.dto.request.UpdateShopInformationRequest;
import com.se.backend.dto.response.ShopInformationResponse;
import com.se.backend.entity.*;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.mapper.AddressMapper;
import com.se.backend.repository.AddressRepository;
import com.se.backend.repository.ProductRepository;
import com.se.backend.repository.ReviewContentRepository;
import com.se.backend.repository.SellerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService{
    @Autowired
    private final SellerRepository sellerRepository;
    @Autowired
    private final AddressRepository addressRepository;
    @Autowired
    private final ReviewContentRepository reviewContentRepository;
    @Autowired
    private final ProductRepository productRepository;
    @Autowired
    private final AddressMapper addressMapper;
    @Override
    @Transactional
    public Boolean statusSeller(String username){
        Optional<Seller> seller = sellerRepository.findByUsername(username);
        if(seller.isPresent()){
            Boolean status = seller.get().getStatus();
            return status ? Boolean.TRUE : Boolean.FALSE;
        }
        return Boolean.FALSE;
    }
    @Override
    public ShopInformationResponse getShopInformation(String username) {
        Seller seller = sellerRepository.findByUsername(username)
                .orElseThrow(()-> new WebServerException(ErrorCode.USER_NOT_FOUND));
        Integer follower  = seller.getFollowers();
        Address address = seller.getAddress();
        double rating;
        int numberOfProduct;
        try{
            List<Product> products = productRepository.findBySeller(seller);
            numberOfProduct = products.size();
        }
        catch (WebServerException e){
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }
        try{
            List<ReviewContent> reviewContentList = reviewContentRepository.findBySeller(seller);
            rating = reviewContentList.stream()
                    .filter(review -> review.getRating() != null)
                    .mapToDouble(ReviewContent::getRating)
                    .average()
                    .orElse(0);
        }
        catch (WebServerException e){
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }

        ShopInformationResponse response = ShopInformationResponse.builder()
                .shopName(seller.getShopName())
                .follower(follower)
                .numberOfProduct(numberOfProduct)
                .rating(rating)
                .address(addressMapper.toShopAddressResponse(address))
                .build();
        return response;
    }

    @Override
    public String updateShopInformation(String username, UpdateShopInformationRequest request){
        Seller seller = sellerRepository.findByUsername(username)
                .orElseThrow(()->new WebServerException(ErrorCode.USER_NOT_FOUND));
        Address address = seller.getAddress();
        try {
            address.setSpecificAddress(request.getAddress().getSpecific_address());
            address.setProvince(request.getAddress().getProvince());
            address.setCommune(request.getAddress().getCommune());
            address.setDistrict(request.getAddress().getDistrict());
            addressRepository.save(address);
        }
        catch (NullPointerException e){
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }
        seller.setShopName(request.getShopName());
        try{
            sellerRepository.save(seller);
        }
        catch (WebServerException e){
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }
        return "Your shop information is up to date";
    }
}
