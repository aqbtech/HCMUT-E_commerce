package com.se.backend.mapper;

import com.se.backend.entity.AttributeInstance;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class AttIns2InstantImpl implements AttributeInstanceMapper {
	@Override
	public Map<String, String> toAttributeInstanceMap(AttributeInstance attributeInstance) {
		Map<String, String> map = new HashMap<>();
		map.put(attributeInstance.getAttribute().getName(), attributeInstance.getValue());
		return map;
	}
}
