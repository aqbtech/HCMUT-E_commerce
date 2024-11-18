package com.se.backend.repository;

import com.se.backend.entity.Cart;
import com.se.backend.entity.Cart_ProductInstance;
import com.se.backend.entity.Cart_ProductInstanceId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Cart_ProductInstanceRepository extends JpaRepository<Cart_ProductInstance, Cart_ProductInstanceId> {
	@EntityGraph(value = "cart-product-instance-detail", type = EntityGraph.EntityGraphType.LOAD)
	Page<Cart_ProductInstance> findByCart(Cart cart, Pageable pageable);
	@EntityGraph(value = "cart-product-instance-detail", type = EntityGraph.EntityGraphType.LOAD)
	List<Cart_ProductInstance> findByCart(Cart cart);
}
