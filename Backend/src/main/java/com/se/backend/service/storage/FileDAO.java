package com.se.backend.service.storage;

import com.google.cloud.WriteChannel;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import com.google.common.collect.ImmutableMap;
import com.google.firebase.cloud.StorageClient;
import com.se.backend.entity.FileInfo;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * FileDAO is a database access object responsible for managing file operations
 * within Firebase Storage. This includes uploading files, generating public URLs
 * for downloads, managing files in folders, and removing files from storage.
 */
@Slf4j
@Repository
public class FileDAO {

	/**
	 * Upload file lên Firebase Storage.
	 */
	public void uploadFile(MultipartFile file, FileInfo fileInfo) {
		try {
			String fileName = constructFilePath(fileInfo);
			String token = UUID.randomUUID().toString();

			Bucket bucket = StorageClient.getInstance().bucket();

			BlobInfo blobInfo = BlobInfo.newBuilder(bucket.getName(), fileName)
					.setContentType(file.getContentType())
					.setMetadata(ImmutableMap.of("firebaseStorageDownloadTokens", token))
					.build();

			try (WriteChannel writer = bucket.getStorage().writer(blobInfo);
				 InputStream inputStream = file.getInputStream()) {
				byte[] buffer = new byte[1024];
				int limit;
				while ((limit = inputStream.read(buffer)) >= 0) {
					writer.write(ByteBuffer.wrap(buffer, 0, limit));
				}
			}
		} catch (IOException e) {
			log.error("Error uploading file: {}", fileInfo.getFileName(), e);
			throw new WebServerException(ErrorCode.FILE_SERVICE_ERROR);
		}
	}

	/**
	 * Download một file - Lấy URL công khai từ Firebase Storage.
	 */
	public ResponseEntity<String> downloadFile(FileInfo fileInfo) {
		try {
			Blob blob = getFileFromBucket(fileInfo);
			if (blob == null || !blob.exists()) {
				throw new RuntimeException("File not found: " + fileInfo.getFileName());
			}

			String publicUrl = generatePublicUrl(blob);
			return ResponseEntity.ok(publicUrl);
		} catch (Exception e) {
			log.error("Error downloading file: {}", fileInfo.getFileName(), e);
			throw new RuntimeException("Error downloading and generating URL for file", e);
		}
	}

	/**
	 * Download tất cả các file trong một folder.
	 */
	public List<String> downloadFiles(String folder) {
		Bucket bucket = StorageClient.getInstance().bucket();
		Iterable<Blob> blobs = bucket.list(Storage.BlobListOption.prefix(folder)).iterateAll();

		List<String> fileLinks = new ArrayList<>();
		for (Blob blob : blobs) {
			// Chỉ xử lý các blob hợp lệ (có kích thước > 0 và metadata với token)
			if (blob.getSize() > 0 && blob.getMetadata() != null && blob.getMetadata().containsKey("firebaseStorageDownloadTokens")) {
				String fileUrl = generatePublicUrl(blob);
				fileLinks.add(fileUrl);
			} else {
				log.warn("Ignoring invalid blob: {}", blob.getName());
			}
		}
		return fileLinks;
	}

	/**
	 * Xóa file khỏi Firebase Storage.
	 */
	public void deleteFile(FileInfo fileInfo) {
		try {
			Blob blob = getFileFromBucket(fileInfo);
			if (blob != null && blob.exists()) {
				blob.delete();
				log.info("File deleted successfully: {}", fileInfo.getFileName());
			} else {
				log.warn("File not found: {}", fileInfo.getFileName());
			}
		} catch (Exception e) {
			log.error("Error deleting file: {}", fileInfo.getFileName(), e);
			throw new RuntimeException("Error deleting file", e);
		}
	}

	/**
	 * Tạo đường dẫn đầy đủ đường dẫn file trong Firebase Storage.
	 */
	private String constructFilePath(FileInfo fileInfo) {
		return (fileInfo.getFolder() == null || fileInfo.getFolder().isEmpty())
				? fileInfo.getFileName()
				: fileInfo.getFolder() + "/" + fileInfo.getFileName();
	}

	/**
	 * Lấy Blob từ bucket dựa trên thông tin FileInfo.
	 */
	private Blob getFileFromBucket(FileInfo fileInfo) {
		String fullPath = constructFilePath(fileInfo);
		Bucket bucket = StorageClient.getInstance().bucket();
		return bucket.get(fullPath);
	}

	/**
	 * Sinh URL công khai từ Blob.
	 */
	private String generatePublicUrl(Blob blob) {
		String token = blob.getMetadata() != null ? blob.getMetadata().get("firebaseStorageDownloadTokens") : null;
		if (token == null) {
			throw new RuntimeException("Token not generated for file: " + blob.getName());
		}

		return String.format(
				"https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media&token=%s",
				blob.getBucket(),
				URLEncoder.encode(blob.getName(), StandardCharsets.UTF_8),
				token
		);
	}
}