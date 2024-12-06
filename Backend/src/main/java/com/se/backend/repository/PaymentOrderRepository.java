package com.se.backend.repository;

import com.se.backend.entity.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {
}
