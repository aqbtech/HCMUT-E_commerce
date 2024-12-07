package com.se.backend.repository;

import com.se.backend.entity.Seller;
import com.se.backend.entity.ShopPolicy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopPolicyRepository extends JpaRepository<ShopPolicy, Long> {
    @Query("SELECT sp FROM ShopPolicy sp JOIN sp.sellers s WHERE s.username = :sellerId")
    List<ShopPolicy> findBySellerId(@Param("sellerId") String sellerId);
    @EntityGraph(value = "shopPolicy", type = EntityGraph.EntityGraphType.LOAD)
    Page<ShopPolicy> findAll(Pageable pageable);
}
