package com.se.backend.service.business;

import com.se.backend.dto.request.FakeOrderInforRequest;
import com.se.backend.dto.response.FakeAPIDeliveryResponse;
import com.se.backend.entity.Order;

public interface DeliveryDateApiService {
    FakeAPIDeliveryResponse fakeAPIDelivery(Order order);

    String fakeInformation(FakeOrderInforRequest request);
}
