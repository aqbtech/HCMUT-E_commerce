package com.se.backend.service.business;

import com.se.backend.dto.response.FakeAPIDeliveryResponse;
import com.se.backend.entity.Delivery;
import com.se.backend.entity.Order;
import com.se.backend.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeliveryDateApiServiceImp implements DeliveryDateApiService {
    @Autowired
    private DeliveryRepository deliveryRepository;
    private final Random random = new Random();
    @Override
    public FakeAPIDeliveryResponse fakeAPIDelivery(Order order) {
        // Lấy danh sách tất cả Delivery từ database
        List<Delivery> deliveries = deliveryRepository.findAll();
        if (deliveries.isEmpty()) {
            throw new IllegalStateException("Does not have any delivery for shipping");
        }
        Delivery randomDelivery = deliveries.get(random.nextInt(deliveries.size()));

        // Random các giá trị như yêu cầu
        String deliveryCode = UUID.randomUUID().toString();
        LocalDate deliveryJoinDate = LocalDate.now().plusDays(random.nextInt(4)); // Random từ hôm nay đến 3 ngày sau
        LocalDate expectedDeliveryDate = deliveryJoinDate.plusDays(random.nextInt(8)); // Random từ deliveryJoinDate đến 7 ngày sau
        int fee = 38 + random.nextInt(34); // Random từ 38 đến 71

        // Trả về FakeAPIDeliveryResponse
        return FakeAPIDeliveryResponse.builder()
                .deliveryName(randomDelivery.getDeliveryName())
                .deliveryCode(deliveryCode)
                .deliveryJoinDate(deliveryJoinDate)
                .expectedDeliveryDate(expectedDeliveryDate)
                .deliveryDate(null) // deliveryDate là null do chưa biết giao tới ngày nào
                .deliveryStatus("SHIPPING") // Status là SHIPPING
                .fee(fee * 1000)
                .build();
    }
}
