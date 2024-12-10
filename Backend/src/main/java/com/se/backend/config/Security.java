package com.se.backend.config;

import com.se.backend.service.CustomJwtDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class Security {
	// This class is used to configure security for the application
	// If you want to use security, you can add configurations here
	private final String[] PUBLIC_ENDPOINTS = {
			"/users", "/auth/token", "/auth/introspect", "/auth/logout", "/auth/refresh",
			"/query_product_detail/**", "/{productId}/reviews", "/home-page", "/register",
			"/search", "/search/filter", "/category", "/shop_information", "/shop_product",
			"/sellerregister",
			"/search", "/search/filter", "/category", "/shop_information", "/shop_product",
			"/create", "/checkout",
			"/database/cart/add", "/database/getProductByCategory"
	};
	private final CustomJwtDecoder customJwtDecoder;

	public Security(CustomJwtDecoder customJwtDecoder) {
		this.customJwtDecoder = customJwtDecoder;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity security) throws Exception {
		security.authorizeHttpRequests(request -> request
				.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS).permitAll()
				.requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS).permitAll()
				.anyRequest().authenticated());

		security.oauth2ResourceServer(oauth2 -> oauth2
				.jwt(jwtConfigurer -> jwtConfigurer
						.decoder(customJwtDecoder)
						.jwtAuthenticationConverter(new CustomJwtAuthenticationConverter())
				).authenticationEntryPoint(new JwtAuthEntryPoint()));
		security.sessionManagement(session ->
				session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		security.csrf(AbstractHttpConfigurer::disable);
		security.cors(cors -> cors.configurationSource(request -> {
			CorsConfiguration corsConfig = new CorsConfiguration();
			corsConfig.addAllowedOrigin("http://localhost:5173");
			corsConfig.addAllowedMethod("*");
			corsConfig.addAllowedHeader("*");
			return corsConfig;
		}));
		return security.build();
	}


	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(10);
	}
}
