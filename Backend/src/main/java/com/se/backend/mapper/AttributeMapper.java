package com.se.backend.mapper;

import com.se.backend.dto.response.AttributeDetail;
import com.se.backend.entity.Attribute;
import com.se.backend.entity.AttributeInstance;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper
public interface AttributeMapper {

	@Mapping(target = "name", source = "name")
	@Mapping(target = "values", source = "attributeInstances", qualifiedByName = "mapAttributeInstancesToValues")
	AttributeDetail toAttributeDetail(Attribute attribute);

	@Named("mapAttributeInstancesToValues")
	default List<String> mapAttributeInstancesToValues(List<AttributeInstance> attributeInstances) {
		if (attributeInstances == null) {
			return null;
		}
		return attributeInstances.stream()
				.map(AttributeInstance::getValue)
				.collect(Collectors.toList());
	}
	List<AttributeDetail> toAttributeDetails(List<Attribute> attributes);
}
