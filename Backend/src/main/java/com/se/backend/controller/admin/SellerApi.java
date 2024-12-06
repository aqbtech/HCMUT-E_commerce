package com.se.backend.controller.admin;

import com.se.backend.dto.response.GetOrderResponse;
import com.se.backend.dto.response.ResponseAPITemplate;
import com.se.backend.dto.response.SellerforAdminResponse;
import com.se.backend.entity.Seller;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.repository.SellerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin/seller")
@RequiredArgsConstructor
public class SellerApi {
    @Autowired
    private final SellerRepository sellerRepository;

    @GetMapping("/get")
    public ResponseAPITemplate<Page<?>> getSeller(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<Seller> sellers = sellerRepository.findAll(pageable);
        List<Seller> sellerList = sellers.getContent();
        List<SellerforAdminResponse> fakeres = new ArrayList<>();
        for(Seller seller : sellerList){
            fakeres.add(SellerforAdminResponse.builder()
                            .sellerName(seller.getUsername())
                            .status(seller.getStatus())
                            .shopName(seller.getShopName())
                    .build());
        }
        Page<SellerforAdminResponse> res = new PageImpl<>(
                fakeres,
                pageable,
                sellers.getTotalElements()
        );
        return ResponseAPITemplate.<Page<?>>builder().result(res).build();
    }

    @PostMapping("/approve")
    public ResponseAPITemplate<String> approveSeller(
            @RequestParam("sellerName") String sellerName
    ){
        Seller seller = sellerRepository.findByUsername(sellerName)
                .orElseThrow(()-> new WebServerException(ErrorCode.USER_NOT_FOUND));
        seller.setStatus(Boolean.TRUE);
        try{
            sellerRepository.save(seller);
        }
        catch (WebServerException e){
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }
        return ResponseAPITemplate.<String>builder().result("Successful").build();
    }
    @DeleteMapping("/delete")
    public ResponseAPITemplate<String> deleteSeller(
            @RequestParam("sellerName") String sellerName
    ){
        Seller seller = sellerRepository.findByUsername(sellerName)
                .orElseThrow(()-> new WebServerException(ErrorCode.USER_NOT_FOUND));
        if(seller.getStatus()){
            return ResponseAPITemplate.<String>builder().code(400).message("Seller was approved before!").build();
        }
        seller.setStatus(Boolean.TRUE);
        try{
            sellerRepository.delete(seller);
        }
        catch (WebServerException e){
            throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
        }
        return ResponseAPITemplate.<String>builder().result("Successful").build();
    }
}
