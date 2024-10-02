package com.se.backend.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class CustomJwtGrantedAuthoritiesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

	@Override
	public Collection<GrantedAuthority> convert(Jwt jwt) {
		List<String> authorityList = jwt.getClaimAsStringList("authorities");
		Collection<GrantedAuthority> authorities = new ArrayList<>();
		Assert.notNull(authorityList, "authorityList cannot be null");
		if (!authorityList.isEmpty()) {
			authorities = authorityList.stream()
					.map(SimpleGrantedAuthority::new)
					.collect(Collectors.toList());
		}
		// Add hardcoded role
		authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
		return authorities;
	}
}