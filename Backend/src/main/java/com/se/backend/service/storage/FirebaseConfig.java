package com.se.backend.service.storage;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class FirebaseConfig {
	@Value("${firebase.config.path}")
	protected String FIREBASE_CONFIG_PATH;
	@PostConstruct
	public void configureFirebaseConnection() throws FileNotFoundException {
		try {
			File file = ResourceUtils.getFile(FIREBASE_CONFIG_PATH);
			FileInputStream serviceAccount = new FileInputStream(file);
			FirebaseOptions options = new FirebaseOptions.Builder()
					.setCredentials(GoogleCredentials.fromStream(serviceAccount))
					.setStorageBucket("spring-mvc-aa495.appspot.com")
					.build();

			FirebaseApp.initializeApp(options);
		} catch (FileNotFoundException e) {
			throw new FileNotFoundException("File not found");
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
}
