package com.se.backend.controller.web;

import com.se.backend.dto.request.*;
import com.se.backend.dto.response.*;
import com.se.backend.service.BuyerService;
import com.se.backend.service.business.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/buyer")
public class BuyerController {

    @Autowired
    private final OrderService orderService;
    @Autowired
    private final BuyerService buyerService;

    @GetMapping("/get_information")
    public ResponseAPITemplate<BuyerInformationResopnse> getInfo(@RequestParam String username){
        BuyerInformationResopnse response = buyerService.getBuyerInformation(username);
        return ResponseAPITemplate.<BuyerInformationResopnse>builder()
                .result(response)
                .build();
    }

    @PutMapping("/update_information")
    public ResponseAPITemplate<String> updateInfo(
            @RequestParam String username,
            @RequestBody UpdateBuyerInformationRequest request){
        String response = buyerService.updateBuyerInformation(username, request);
        return ResponseAPITemplate.<String>builder()
                .message(response)
                .build();
    }

    @PutMapping("/delete_order")
    public ResponseAPITemplate<CancelOrderResponse> cancelOrder(@RequestBody CancelOrderRequest request){
        CancelOrderResponse response = orderService.cancelOrder(request);
        return ResponseAPITemplate.<CancelOrderResponse>builder()
                .message(response.getMsg())
                .build();
    }

    @PostMapping("/order")
    public ResponseAPITemplate<CreateOrderResponse> createOrder(
            @RequestBody CreateOrderRequest request){
        CreateOrderResponse response = orderService.create(request);
        return ResponseAPITemplate.<CreateOrderResponse>builder()
                .result(response)
                .build();
    }

    @GetMapping("/order/{username}")
    public ResponseAPITemplate<Page<GetOrderResponse>> getOrderOfUser(
            @PathVariable("username") String username,
            @RequestParam Optional<Integer> page,
            @RequestParam Optional<Integer> limit) {
        Pageable pageable = PageRequest.of(page.orElse(0), limit.orElse(10));
        Page<GetOrderResponse> response = orderService.getOrderForBuyer(username, pageable);
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

    @PutMapping("/order/updatestate/{id}")
    public ResponseAPITemplate<CreateOrderResponse> updateStateOfOrder(@PathVariable("id") String order_id,
                                                                       @RequestBody UpdateStateOfOrderRequest request){
        CreateOrderResponse response = orderService.updateOrderState(order_id, request.getStatus());
        return ResponseAPITemplate.<CreateOrderResponse>builder()
                .result(response)
                .build();
    }
    @PutMapping("/order/addproduct/{orderId}")
    public ResponseAPITemplate<String> addProductToOrder(
            @PathVariable String orderId,
            @RequestBody AddProductRequest request){
        String response = orderService.addProductToOrder(orderId, request);
        return ResponseAPITemplate.<String>builder()
                .result(response)
                .build();
    }

    @PatchMapping("/order/updatequantity/{orderId}")
    public ResponseAPITemplate<CreateOrderResponse> updateQuantityOfProduct(
            @PathVariable String orderId,
            @RequestBody UpdateQuantityOfProductRequest request){
        CreateOrderResponse response = orderService.updateQuantityOfProductFromOrder(orderId, request);
        return ResponseAPITemplate.<CreateOrderResponse>builder()
                .result(response)
                .build();
    }

    //Payment
}
