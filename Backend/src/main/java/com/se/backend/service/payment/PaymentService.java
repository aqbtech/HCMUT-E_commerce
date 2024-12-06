package com.se.backend.service.payment;

// Java version "1.8.0_201"

import com.se.backend.utils.vn.zalopay.crypto.HMACUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.*;
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {
	private final PaymentConfig config;
	public static String getCurrentTimeString(String format) {
		Calendar cal = new GregorianCalendar(TimeZone.getTimeZone("GMT+7"));
		SimpleDateFormat fmt = new SimpleDateFormat(format);
		fmt.setCalendar(cal);
		return fmt.format(cal.getTimeInMillis());
	}
	public String checkoutOrder(String app_trans_id){
		try {
			String data = config.getAPP_ID() + "|" + app_trans_id + "|" + config.getKEY1(); // appid|app_trans_id|key1
			String mac = HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, config.getKEY1(), data);
			List<NameValuePair> params = new ArrayList<>();
			params.add(new BasicNameValuePair("app_id", config.getAPP_ID()));
			params.add(new BasicNameValuePair("app_trans_id", app_trans_id));
			params.add(new BasicNameValuePair("mac", mac));
			JSONObject result = sendRequest(params, "/v2/query");
			Set<String> keys = result.keySet();
			if (keys.contains("return_code")) {
				// save order to database
				return result.get("return_code").toString();
			} else {
				log.error("Error while checkout payment order: {}", result.getString("return_message"));
				throw new RuntimeException(result.getString("return_message"));
			}
		} catch (Exception e) {
			log.error("Error while creating payment order", e);
			throw new RuntimeException(e);
		}
	}
	public String createPaymentOrder(int paymentOrderId, int amount, String description, JSONObject[] item, String username) {
		Map<String, Object> order = new HashMap<>() {{
			put("app_id", config.getAPP_ID());
			put("app_trans_id", getCurrentTimeString("yyMMdd") + "_" + paymentOrderId); // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
			put("app_time", System.currentTimeMillis()); // miliseconds
			put("app_user", username);
			put("amount", amount);
			put("description", description);
			put("bank_code", "");
			put("item", Arrays.toString(item));
			put("embed_data", "{}");
		}};
		String data = order.get("app_id") + "|" + order.get("app_trans_id") + "|" + order.get("app_user") + "|" + order.get("amount")
				+ "|" + order.get("app_time") + "|" + order.get("embed_data") + "|" + order.get("item");
		order.put("mac", HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, config.getKEY1(), data));
		System.out.println("Data: " + data);
		System.out.println("MAC: " + order.get("mac"));
		try {
			List<NameValuePair> params = new ArrayList<>();
			for (Map.Entry<String, Object> e : order.entrySet()) {
				params.add(new BasicNameValuePair(e.getKey(), e.getValue().toString()));
			}
			JSONObject result = sendRequest(params, "/v2/create");
			Set<String> keys = result.keySet();
			if (keys.contains("order_url")) {
				log.info("Payment order app_trans_id: {}", order.get("app_trans_id"));
				return result.getString("order_url");
				// save order to database
			} else {
				log.error("Error while creating payment order: {}", result.getString("return_message"));
				throw new RuntimeException(result.getString("return_message"));
			}
		} catch (Exception e) {
			log.error("Error while creating payment order", e);
			throw new RuntimeException(e);
		}

	}
	private JSONObject sendRequest(List<NameValuePair> params, String endpoint) {
		try (CloseableHttpClient client = HttpClients.createDefault()) {
			HttpPost post = new HttpPost(config.getDOMAIN() + endpoint);
			StringBuilder resultJsonStr;

			// Content-Type: application/x-www-form-urlencoded
			post.setEntity(new UrlEncodedFormEntity(params));

			CloseableHttpResponse res = client.execute(post);
			BufferedReader rd = new BufferedReader(new InputStreamReader(res.getEntity().getContent()));
			resultJsonStr = new StringBuilder();
			String line;

			while ((line = rd.readLine()) != null) {
				resultJsonStr.append(line);
			}
			return new JSONObject(resultJsonStr.toString());
		} catch (IOException e) {
			log.error("Error while sending request to ZaloPay", e);
			throw new RuntimeException(e);
		}
	}
}

