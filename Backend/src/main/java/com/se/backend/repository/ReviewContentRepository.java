package com.se.backend.repository;

import com.se.backend.entity.ReviewContent;
import com.se.backend.entity.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewContentRepository extends JpaRepository<ReviewContent, String> {
    List<ReviewContent> findBySeller(Seller seller);
}
