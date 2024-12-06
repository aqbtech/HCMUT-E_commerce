package com.se.backend.service.payment;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import java.util.HashMap;
import java.util.Map;

@Component
@Getter
public class PaymentConfig {
	@NonFinal
	@Value("${payment.zalo.app-id}")
	protected String APP_ID;
	@NonFinal
	@Value("${payment.zalo.secret-key}")
	protected String KEY1;
	@NonFinal
	@Value("${payment.zalo.public-key}")
	protected String KEY2;
	@NonFinal
	@Value("${payment.zalo.endpoint}")
	protected String DOMAIN;
	@Getter
	private Map<String, String> config;
	@PostConstruct
	public void setConfig() {
		Assert.notNull(APP_ID, "APP_ID must not be null");
		Assert.notNull(KEY1, "secret-key must not be null");
		Assert.notNull(KEY2, "public-key must not be null");
		Assert.notNull(DOMAIN, "ENDPOINT must not be null");
		config = new HashMap<>() {{
			put("app_id", APP_ID);
			put("key1", KEY1);
			put("key2", KEY2);
			put("endpoint", DOMAIN);
		}};
	}
}
