package com.se.backend.controller.admin;

import com.se.backend.dto.request.FakeOrderInforRequest;
import com.se.backend.dto.response.GetOrderResponse;
import com.se.backend.dto.response.ResponseAPITemplate;
import com.se.backend.service.business.DeliveryDateApiService;
import com.se.backend.service.business.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/admin/order")
@AllArgsConstructor
public class OrderApi {
    private OrderService orderService;
    private DeliveryDateApiService deliveryDateApiService;
    @GetMapping
    public ResponseAPITemplate<Page<?>> getOrder(
            @RequestParam(defaultValue = "all") String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam String username
    ) {
        Set<String> validTypes = Set.of("all", "waiting", "shipping", "canceled", "approved", "completed");
        if (!validTypes.contains(type.toLowerCase())) {
            return ResponseAPITemplate.<Page<?>>builder().code(400).message("Something wrong. Try it again!").build();
        }
        Pageable pageable = PageRequest.of(page, size);
        Page<GetOrderResponse> res = orderService.getOrdersBySellerAndStatus(username, type, pageable);
        return ResponseAPITemplate.<Page<?>>builder().result(res).build();
    }

    @PostMapping
    public ResponseAPITemplate<String> getOrder(@RequestBody FakeOrderInforRequest request){
        String res = deliveryDateApiService.fakeInformation(request);
        return ResponseAPITemplate.<String>builder().result(res).build();
    }
}
