package com.se.backend.service.storage;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Bucket;
import com.google.common.collect.ImmutableMap;
import com.google.firebase.cloud.StorageClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.UUID;

@Repository
public class FileDAO {

	public void uploadFile(MultipartFile file, FileInfo fileInfo) {
		try {
			// Construct the file path
			String fileName = constructFilePath(fileInfo);

			// Generate a token for public access
			String token = UUID.randomUUID().toString();

			// Access the bucket
			Bucket bucket = StorageClient.getInstance().bucket();

			// Create metadata with the token
			BlobInfo blobInfo = BlobInfo.newBuilder(bucket.getName(), fileName)
					.setContentType(file.getContentType()) // Set MIME type
					.setMetadata(ImmutableMap.of("firebaseStorageDownloadTokens", token)) // Add the token
					.build();

			// Upload the file with metadata
			bucket.create(blobInfo.getName(), file.getInputStream(), blobInfo.getContentType());

		} catch (IOException e) {
			throw new RuntimeException("Error uploading file", e);
		}
	}

	private Blob initBucketStorage(FileInfo fileInfo) {
		String fullPath = (fileInfo.getFolder() == null || fileInfo.getFolder().isEmpty()) ? fileInfo.getFileName() : fileInfo.getFolder() + "/" + fileInfo.getFileName();
		Bucket bucket = StorageClient.getInstance().bucket();
		Blob blob = bucket.get(fullPath);
		if (blob == null) {
			throw new RuntimeException("File not found: " + fullPath);
		}
		return blob;
	}

	public ResponseEntity<String> downloadFile(FileInfo fileInfo) {
		try {
			// Lấy Blob từ Google Cloud Storage
			Blob blob = initBucketStorage(fileInfo);
			if (!blob.exists()) {
				throw new RuntimeException("File not found: " + fileInfo.getFileName());
			}

			String firebaseFilePath = constructFilePath(fileInfo);

			// Lấy token từ metadata
			String token = Objects.requireNonNull(blob.getMetadata()).get("firebaseStorageDownloadTokens");
			if (token == null) {
				throw new RuntimeException("Token not generated for file: " + fileInfo.getFileName());
			}

			// Tạo URL công khai với token
			String publicUrl = String.format("https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media&token=%s",
					blob.getBucket(),
					URLEncoder.encode(firebaseFilePath, StandardCharsets.UTF_8),
					token);

			// Trả về URL công khai
			return ResponseEntity.ok(publicUrl);
		} catch (NullPointerException e) {
			throw new IllegalArgumentException("File not found: " + fileInfo.getFileName());
		} catch (Exception e) {
			throw new RuntimeException("Error downloading and generating URL for file", e);
		}
	}

	public void deleteFile(FileInfo fileInfo) {
		Blob blob = getFileFromBucket(fileInfo);
		try {
			blob.delete();
		} catch (NullPointerException e) {
			throw new IllegalArgumentException("File not found: " + fileInfo.getFileName());
		}
	}

	// Helper to construct file path
	private String constructFilePath(FileInfo fileInfo) {
		return (fileInfo.getFolder() == null || fileInfo.getFolder().isEmpty())
				? fileInfo.getFileName()
				: fileInfo.getFolder() + "/" + fileInfo.getFileName();
	}

	// Helper to retrieve Blob object from the bucket
	private Blob getFileFromBucket(FileInfo fileInfo) {
		String fullPath = constructFilePath(fileInfo);
		Bucket bucket = StorageClient.getInstance().bucket();
		Blob blob = bucket.get(fullPath);
		if (blob == null) {
			throw new RuntimeException("File not found in bucket: " + fullPath);
		}
		return blob;
	}
}
