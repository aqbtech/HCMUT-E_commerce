package com.se.backend.controller.admin;

import com.se.backend.dto.request.FakeOrderInforRequest;
import com.se.backend.dto.response.CategoryInfo;
import com.se.backend.dto.response.GetOrderResponse;
import com.se.backend.dto.response.ResponseAPITemplate;
import com.se.backend.entity.Order;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.repository.OrderRepository;
import com.se.backend.service.business.DeliveryDateApiService;
import com.se.backend.service.business.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/order")
@RequiredArgsConstructor
public class OrderApi {
    @Autowired
    private OrderService orderService;
    @Autowired
    private DeliveryDateApiService deliveryDateApiService;
    @GetMapping
    public ResponseAPITemplate<Page<?>> getOrder(
            @RequestParam(defaultValue = "all") String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam String username
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<GetOrderResponse> res = null;
        if("all".equals(type)){
            res = orderService.getOrderForBuyer(username, pageable);
        }
        else if("waiting".equals(type)){
            res = orderService.getWaitingOrder(username, pageable);
        }
        else if("shipping".equals(type)){
            res = orderService.getShippingOrder(username, pageable);
        }
        else if("canceled".equals(type)){
            res = orderService.getCancelledOrder(username, pageable);
        }
        else if("approved".equals(type)){
            res = orderService.getApprovedOrder(username, pageable);
        }
        else if("completed".equals(type)){
            res = orderService.getCompletedOrder(username, pageable);
        }
        else{
            return ResponseAPITemplate.<Page<?>>builder().code(400).message("Something wrong. Try it again!").result(res).build();
        }
        return ResponseAPITemplate.<Page<?>>builder().result(res).build();
    }

    @PostMapping
    public ResponseAPITemplate<String> getOrder(@RequestBody FakeOrderInforRequest request){
        String res = deliveryDateApiService.fakeInformation(request);
        return ResponseAPITemplate.<String>builder().result(res).build();
    }
}
