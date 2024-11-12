package com.se.backend.repository;

import com.se.backend.entity.Buyer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BuyerRepository extends JpaRepository<Buyer, String> {
    Optional<Buyer> findByUsername(String s);
}
