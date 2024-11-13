package com.se.backend.repository;

import com.se.backend.entity.BuyerCartId;
import com.se.backend.entity.Cart;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart, BuyerCartId> {
	@EntityGraph(value = "cart-detail", type = EntityGraph.EntityGraphType.LOAD)
	Page<Cart> findByBuyerUsername(String username, Pageable pageable);
}
