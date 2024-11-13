package com.se.backend.mapper;

import com.se.backend.dto.response.CreateOrderResponse;
import com.se.backend.dto.response.ProductResponse;
import com.se.backend.entity.Order;
import com.se.backend.entity.Order_ProductInstance;
import org.mapstruct.Mapper;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {

}
