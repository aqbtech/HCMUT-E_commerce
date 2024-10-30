package com.se.backend.config;

import com.se.backend.entity.Admin;
import com.se.backend.entity.User;
import com.se.backend.repository.AdminRepository;
import com.se.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(makeFinal = true)
public class ApplicationConfig {
	// This class is used to configure the application for the first run
	@NonFinal
	private static final String ADMIN_USER_NAME = "admin";
	@NonFinal
	private static final String ADMIN_PASSWORD = "admin";
	@Bean
	@ConditionalOnProperty(
		prefix = "spring",
		value = "datasource.driverClassName",
		havingValue = "com.mysql.cj.jdbc.Driver"
	)
	ApplicationRunner applicationRunner(UserRepository userRepository, AdminRepository adminRepository,PasswordEncoder passwordEncoder) {
		log.info("Initializing application.....");
		return args -> {
			if (!userRepository.existsByUsername(ADMIN_USER_NAME)) {
				Admin admin = Admin.builder()
						.username(ADMIN_USER_NAME)
						.password(passwordEncoder.encode(ADMIN_PASSWORD))
						.build();
				adminRepository.save(admin);
				log.warn("Admin user created with username: {} and password: {}", ADMIN_USER_NAME, ADMIN_PASSWORD);
			}
			log.info("Application initialized successfully");
		};
	}
}
