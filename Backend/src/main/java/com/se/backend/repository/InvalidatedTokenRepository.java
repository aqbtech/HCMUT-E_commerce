package com.se.backend.repository;

import com.se.backend.entity.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvalidatedTokenRepository  extends JpaRepository<InvalidatedToken, String> {
}
