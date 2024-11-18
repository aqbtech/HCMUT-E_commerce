package com.se.backend.repository;

import com.se.backend.entity.Buyer;
import com.se.backend.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

//    @Query("SELECT o FROM Order o  WHERE o.paymentOrder.deliveryInfor.buyer.username = :username")
//    Page<Order> findByUsername(@Param("username") String username, Pageable pageable);\
    @EntityGraph(value = "order-Product-Instance", type = EntityGraph.EntityGraphType.LOAD)
    Page<Order> findOrdersByPaymentOrderDeliveryInforBuyer(Buyer buyer, Pageable pageable);

}
