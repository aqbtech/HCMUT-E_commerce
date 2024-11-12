package com.se.backend.mapper;

import com.se.backend.entity.AttributeInstance;
import org.mapstruct.factory.Mappers;
import org.springframework.context.annotation.Bean;

import java.util.Map;
public interface AttributeInstanceMapper {

	AttributeInstanceMapper INSTANCE = Mappers.getMapper(AttributeInstanceMapper.class);

	Map<String, String> toAttributeInstanceMap(AttributeInstance attributeInstance);

}

