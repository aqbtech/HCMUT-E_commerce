package com.se.backend.controller.web;

import com.se.backend.dto.request.*;
import com.se.backend.dto.response.ResponseAPITemplate;
import com.se.backend.service.business.OrderService;
import com.se.backend.dto.response.OrderResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/order/getall/{buyerId}")
    public ResponseAPITemplate<List<OrderResponse>> getAllOrder(@PathVariable("buyerId") String buyerId){
        List<OrderResponse> response = orderService.getAll(buyerId);
            return ResponseAPITemplate.<List<OrderResponse>>builder()
                    .result(response)
                    .build();
    }
    @GetMapping("/order/{id}")
    public ResponseAPITemplate<OrderResponse> detailInfoOfPaymentOrder(@PathVariable("id") String order_id){
        OrderResponse response = orderService.findById(order_id);
        return ResponseAPITemplate.<OrderResponse>builder()
                .result(response)
                .build();
    }
    @PostMapping("/order")
    public ResponseAPITemplate<List<OrderResponse>> createOrder(
            @RequestBody CreateOrderRequest request){
        List<OrderResponse> response = orderService.create(request);
        return ResponseAPITemplate.<List<OrderResponse>>builder()
                .result(response)
                .build();
    }
    @PutMapping("/order/updatestate/{id}")
    public ResponseAPITemplate<OrderResponse> updateStateOfOrder(@PathVariable("id") String order_id,
                                                                 @RequestBody UpdateStateOfOrderRequest request){
        OrderResponse response = orderService.updateOrderState(order_id, request.getStatus());
        return ResponseAPITemplate.<OrderResponse>builder()
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
    public ResponseAPITemplate<OrderResponse> updateQuantityOfProduct(
            @PathVariable String orderId,
            @RequestBody UpdateQuantityOfProductRequest request){
        OrderResponse response = orderService.updateQuantityOfProductFromOrder(orderId, request);
        return ResponseAPITemplate.<OrderResponse>builder()
                .result(response)
                .build();
    }

    //Payment
}
