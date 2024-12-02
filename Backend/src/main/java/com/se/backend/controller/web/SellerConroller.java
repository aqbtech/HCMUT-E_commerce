package com.se.backend.controller.web;

import com.se.backend.dto.request.ApproveOrderRequest;
import com.se.backend.dto.request.CancelOrderRequest;
import com.se.backend.dto.request.UpdateShopInformationRequest;
import com.se.backend.dto.response.*;
import com.se.backend.service.SellerService;
import com.se.backend.service.business.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping(value = "/seller")
public class SellerConroller {

    @Autowired
    private final OrderService orderService;
    @Autowired
    private final SellerService sellerService;

    @GetMapping("/shop_information")
    public ResponseAPITemplate<ShopInformationResponse> getShopInfo(@RequestParam String username){
        ShopInformationResponse response = sellerService.getShopInformation(username);
        return ResponseAPITemplate.<ShopInformationResponse>builder()
                .result(response)
                .build();
    }

    @PutMapping("/update_information")
    public ResponseAPITemplate<String> updateInfo(
            @RequestParam String username,
            @RequestBody UpdateShopInformationRequest request){
        String response = sellerService.updateShopInformation(username, request);
        return ResponseAPITemplate.<String>builder()
                .message(response)
                .build();
    }

    @PutMapping("/approve_order")
    public ResponseAPITemplate<ApproveOrderResponse> approveOrder(@RequestBody ApproveOrderRequest request){
        log.info(request.getOrderId());
        ApproveOrderResponse response = orderService.approveOrder(request);
        return ResponseAPITemplate.<ApproveOrderResponse>builder()
                .message(response.getMsg())
                .build();
    }

    @PutMapping("/delete_order")
    public ResponseAPITemplate<CancelOrderResponse> cancelOrder(@RequestBody CancelOrderRequest request){
        CancelOrderResponse response = orderService.cancelOrder(request);
        return ResponseAPITemplate.<CancelOrderResponse>builder()
                .message(response.getMsg())
                .build();
    }

    @GetMapping("/approved_order/{username}")
    public ResponseAPITemplate<Page<GetOrderResponse>> getApprovedOrder(
            @PathVariable("username") String username,
            @RequestParam Optional<Integer> page,
            @RequestParam Optional<Integer> limit) {
        Pageable pageable = PageRequest.of(page.orElse(0), limit.orElse(10));
        Page<GetOrderResponse> response = orderService.getApprovedOrder(username, pageable);
        if (response == null || response.isEmpty()) {
            return ResponseAPITemplate.<Page<GetOrderResponse>>builder()
                    .message("does not have any order")
                    .result(response)
                    .build();
        }
        return ResponseAPITemplate.<Page<GetOrderResponse>>builder()
                .result(response)
                .build();
    }

    @GetMapping("/waiting_order/{username}")
    public ResponseAPITemplate<Page<GetOrderResponse>> getWaitingOrder(
            @PathVariable("username") String username,
            @RequestParam Optional<Integer> page,
            @RequestParam Optional<Integer> limit) {
        Pageable pageable = PageRequest.of(page.orElse(0), limit.orElse(10));
        Page<GetOrderResponse> response = orderService.getWaitingOrder(username, pageable);
        if (response == null || response.isEmpty()) {
            return ResponseAPITemplate.<Page<GetOrderResponse>>builder()
                    .message("does not have any order")
                    .result(response)
                    .build();
        }
        return ResponseAPITemplate.<Page<GetOrderResponse>>builder()
                .result(response)
                .build();
    }
}
