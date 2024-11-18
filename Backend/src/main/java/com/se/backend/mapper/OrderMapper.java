package com.se.backend.mapper;

import com.se.backend.dto.response.CreateOrderResponse;
import com.se.backend.dto.response.GetOrderResponse;
import com.se.backend.dto.response.ProductResponse;
import com.se.backend.entity.Order;
import com.se.backend.entity.Order_ProductInstance;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(target = "orderId", source = "orderId")
    @Mapping(target = "deliveryState", source = "status")
    @Mapping(target = "sellerName", source = "seller.shopName")
    @Mapping(target = "price", source = "totalPrice")
    @Mapping(target = "listProduct", ignore = true)
    @Mapping(target = "deliveryAddress", ignore = true)
    @Mapping(target = "method", ignore = true)
    GetOrderResponse OrderToResponse(Order order);
}
