package com.se.backend.repository;

import com.se.backend.entity.Business;
import com.se.backend.entity.PaymentInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentInfoRepository extends JpaRepository<PaymentInfo, String> {
    PaymentInfo findPaymentInfoByBusinessAndCardNumber(Business business, String stk);
}
