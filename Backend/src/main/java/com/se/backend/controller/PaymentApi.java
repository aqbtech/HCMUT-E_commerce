package com.se.backend.controller;

import com.se.backend.service.payment.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
public class PaymentApi {
	private final PaymentService paymentService;

	@GetMapping("/checkout")
	public ResponseEntity<String> checkout(@RequestParam String orderId) {
		String res = paymentService.checkoutOrder(orderId);
		return ResponseEntity.ok(res);
	}
	@PostMapping("/create")
	public ResponseEntity<String> create() {
		String url = paymentService.createPaymentOrder(100, 1000, "description", new JSONObject[]{}, "username");
		return ResponseEntity.ok(url);
	}
}
