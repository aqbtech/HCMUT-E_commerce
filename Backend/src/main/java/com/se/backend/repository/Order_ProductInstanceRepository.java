package com.se.backend.repository;

import com.se.backend.entity.Order_ProductInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import com.se.backend.entity.Order_ProductInstanceId;
import org.springframework.stereotype.Repository;

@Repository
public interface Order_ProductInstanceRepository extends JpaRepository<Order_ProductInstance, Order_ProductInstanceId>{
}
