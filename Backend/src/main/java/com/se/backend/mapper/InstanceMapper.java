package com.se.backend.mapper;

import com.se.backend.dto.response.Instant;
import com.se.backend.entity.ProductInstance;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface InstanceMapper {
	InstanceMapper INSTANCE = Mappers.getMapper(InstanceMapper.class);
	@Mapping(target = "instantId", source = "id")
	@Mapping(target = "attributes", ignore = true)
	@Mapping(target = "price", source = "price")
	@Mapping(target = "quantityInStock", source = "quantityInStock")
	Instant toInstant(ProductInstance instant);

	List<Instant> toInstants(List<ProductInstance> instants);
}
