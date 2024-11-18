package com.se.backend.repository;

import com.se.backend.entity.DeliveryInfor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryInfoRepository extends CrudRepository<DeliveryInfor, Long> {
	@Query("SELECT d FROM DeliveryInfor d JOIN d.buyer b WHERE b.username = :username")
	Optional<List<DeliveryInfor>> findByUserId(@Param("username") String userId);
}
