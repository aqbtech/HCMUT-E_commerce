package com.se.backend.mapper;

import com.se.backend.dto.response.GetOrderResponse;
import com.se.backend.dto.response.ReviewProductInstanceResponse;
import com.se.backend.entity.Order;
import com.se.backend.entity.Order_ProductInstance;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderReviewMapper {
    @Mapping(target = "productName", ignore = true)
    @Mapping(target = "orderId", source = "order.orderId")
    @Mapping(target = "productInstanceId", source = "productInstance.id")
    @Mapping(target = "price", ignore = true)
    @Mapping(target = "value", ignore = true)
    @Mapping(target = "reviewInfo", ignore = true)
    ReviewProductInstanceResponse.OrderReview ORDER_REVIEW(Order_ProductInstance orderProductInstance);
}
