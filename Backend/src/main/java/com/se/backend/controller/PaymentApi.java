package com.se.backend.controller;

import com.se.backend.repository.PaymentOrderRepository;
import com.se.backend.service.payment.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
public class PaymentApi {
	private final PaymentService paymentService;
	private final PaymentOrderRepository paymentOrderRepository;

	@GetMapping("/checkout")
	public ResponseEntity<String> checkout(@RequestParam String orderId) {
		String res = paymentService.checkoutOrder(orderId);
		return ResponseEntity.ok(res);
	}
	@PostMapping("/create")
	public ResponseEntity<String> create() {
		String url = paymentService.createPaymentOrder(1001212, 100000, "description", new JSONObject[]{}, "username").get("order_url");
		return ResponseEntity.ok(url);
	}
}
