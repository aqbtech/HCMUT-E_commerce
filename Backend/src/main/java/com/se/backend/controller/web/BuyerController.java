package com.se.backend.controller.web;

import com.se.backend.dto.request.*;
import com.se.backend.dto.response.GetOrderResponse;
import com.se.backend.dto.response.ResponseAPITemplate;
import com.se.backend.service.business.OrderService;
import com.se.backend.dto.response.CreateOrderResponse;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Request;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/buyer")
public class BuyerController {

    @Autowired
    private final OrderService orderService;

//    @DeleteMapping("/order/{id}")
//    public ResponseEntity<String> deleteOrder(@PathVariable("id") String orderId){
//        String message = this.orderService.deleteOrder(orderId);
//        return ResponseEntity.ok(message);
//    }

//    @GetMapping("/order/getall/{buyerId}")
//    public ResponseAPITemplate<List<CreateOrderResponse>> getAllOrder(@PathVariable("buyerId") String buyerId){
//        List<CreateOrderResponse> response = orderService.getAll(buyerId);
//            return ResponseAPITemplate.<List<CreateOrderResponse>>builder()
//                    .result(response)
//                    .build();
//    }
//    @GetMapping("/order/{id}")
//    public ResponseAPITemplate<CreateOrderResponse> detailInfoOfPaymentOrder(@PathVariable("id") String order_id){
//        CreateOrderResponse response = orderService.findById(order_id);
//        return ResponseAPITemplate.<CreateOrderResponse>builder()
//                .result(response)
//                .build();
//    }
    @PostMapping("/order")
    public ResponseAPITemplate<CreateOrderResponse> createOrder(
            @RequestBody CreateOrderRequest request){
        CreateOrderResponse response = orderService.create(request);
        return ResponseAPITemplate.<CreateOrderResponse>builder()
                .result(response)
                .build();
    }

    @GetMapping("/order/{username}")
    public ResponseAPITemplate<List<GetOrderResponse>> getOrderOfUser(
            @PathVariable("username") String username,
            @RequestParam Optional<Integer> page,
            @RequestParam Optional<Integer> limit) {
        Pageable pageable = PageRequest.of(page.orElse(0), limit.orElse(1));
        List<GetOrderResponse> response = orderService.getOrder(username, pageable);
        if (response == null || response.isEmpty()) {
        return ResponseAPITemplate.<List<GetOrderResponse>>builder()
                .message("does not have any order")
                .result(response)
                .build();
        }
        return ResponseAPITemplate.<List<GetOrderResponse>>builder()
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
