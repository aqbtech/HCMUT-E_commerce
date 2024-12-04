package com.se.backend.repository;

import com.se.backend.entity.Buyer;
import com.se.backend.entity.Order;
import com.se.backend.entity.Seller;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

//    @Query("SELECT o FROM Order o  WHERE o.paymentOrder.deliveryInfor.buyer.username = :username")
//    Page<Order> findByUsername(@Param("username") String username, Pageable pageable);\
    @EntityGraph(value = "order-Product-Instance", type = EntityGraph.EntityGraphType.LOAD)
    Page<Order> findOrdersByPaymentOrderDeliveryInforBuyer(Buyer buyer, Pageable pageable);

    @EntityGraph(value = "order-Product-Instance", type = EntityGraph.EntityGraphType.LOAD)
    @Query("select o from Order o where o.seller = :seller and o.status = 'APPROVED'")
    Page<Order> findApprovedOrderBySeller(@Param("seller") Seller seller,Pageable pageable);

    @EntityGraph(value = "order-Product-Instance", type = EntityGraph.EntityGraphType.LOAD)
    @Query("select o from Order o where o.seller = :seller and o.status = 'CANCELLED'")
    Page<Order> findCancelOrderBySeller(@Param("seller") Seller seller,Pageable pageable);

    @EntityGraph(value = "order-Product-Instance", type = EntityGraph.EntityGraphType.LOAD)
    @Query("select o from Order o where o.seller = :seller and o.status = 'WAITING'")
    Page<Order> findWaitingOrderBySeller(@Param("seller") Seller seller,Pageable pageable);

    @EntityGraph(value = "order-Product-Instance", type = EntityGraph.EntityGraphType.LOAD)
    @Query("select o from Order o where o.seller = :seller and o.status = 'SHIPPING'")
    Page<Order> findShippingOrderBySeller(@Param("seller") Seller seller,Pageable pageable);

    @EntityGraph(value = "order-Product-Instance", type = EntityGraph.EntityGraphType.LOAD)
    @Query("select o from Order o where o.seller = :seller and o.status = 'COMPLETED'")
    Page<Order> findCompletedOrderBySeller(@Param("seller") Seller seller,Pageable pageable);

    @EntityGraph(value = "order-Product-Instance", type = EntityGraph.EntityGraphType.LOAD)
    Optional<Order> findByOrderId(String orderId);

    @EntityGraph(value = "order", type = EntityGraph.EntityGraphType.LOAD)
    List<Order> findOrdersByPaymentOrderDeliveryInforBuyer(Buyer buyer);



}
