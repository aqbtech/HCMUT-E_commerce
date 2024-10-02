package com.se.backend.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Collection;
import java.util.stream.Collectors;

public class CustomJwtGrantedAuthoritiesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

	@Override
	public Collection<GrantedAuthority> convert(Jwt jwt) {
		Collection<GrantedAuthority> authorities = jwt.getClaimAsStringList("scope")
				.stream()
				.map(SimpleGrantedAuthority::new)
				.collect(Collectors.toList());

		Collection<GrantedAuthority> customAuthorities = jwt.getClaimAsStringList("custom_claim")
				.stream()
				.map(SimpleGrantedAuthority::new)
				.collect(Collectors.toList());

		// Add hardcoded role
		customAuthorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));

		authorities.addAll(customAuthorities);
		return authorities;
	}
}