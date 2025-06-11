package com.se.backend.service.storage;

import com.cloudinary.Cloudinary;
import com.cloudinary.api.ApiResponse;
import com.cloudinary.utils.ObjectUtils;
import com.se.backend.entity.FileInfo;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

/**
 * FileDAO is a database access object responsible for managing file operations
 * within Firebase Storage. This includes uploading files, generating public URLs
 * for downloads, managing files in folders, and removing files from storage.
 */
@Slf4j
@Repository
//@RequiredArgsConstructor
public class FileDAO {

	private final Cloudinary cloudinary;

	public FileDAO(Cloudinary cloudinary) {
		this.cloudinary = cloudinary;
	}

	/**
	 * Upload file lên Cloudinary vào folder theo product
	 */
	public String uploadFile(MultipartFile file, FileInfo fileInfo) {
		try {
			// full publicId sẽ là: products/123/0
			String publicId = fileInfo.getFileName();

			Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
					"public_id", publicId,
					"folder", fileInfo.getFolder(),
					"resource_type", "image",
					"use_filename", false,
					"overwrite", true
			));
			log.info("link, {}", uploadResult.get("secure_url"));
			return (String) uploadResult.get("secure_url");

		} catch (IOException e) {
			log.error("Upload error: {}", fileInfo.getFileName(), e);
			throw new WebServerException(ErrorCode.FILE_SERVICE_ERROR);
		}
	}

	/**
	 * Sinh URL ảnh public (nếu biết publicId)
	 */
	public String downloadFile(FileInfo fileInfo) {
		if (!Objects.equals(fileInfo.getProduct().getId(), fileInfo.getFolder())) {
			return fileInfo.getFolder();
		}
		String publicId = fileInfo.getFolder() + "/" + fileInfo.getFileName();
		try {
			ApiResponse result = cloudinary.api().resourcesByIds(List.of(publicId), ObjectUtils.emptyMap());


			List<Map<String, Object>> resources = (List<Map<String, Object>>) result.get("resources");
			List<String> urls = new ArrayList<>();
			for (Map<String, Object> res : resources) {
				urls.add((String) res.get("secure_url"));
			}
			return urls.getFirst();

		} catch (Exception e) {
			log.error("Failed to fetch file {}: {}", publicId, e.getMessage());
			throw new RuntimeException("Cloudinary folder search failed");
		}
	}

	/**
	 * Xoá ảnh khỏi Cloudinary
	 */
	public void deleteFile(FileInfo fileInfo) {
		String publicId = fileInfo.getFolder() + "/" + fileInfo.getFileName();

		try {
			Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.asMap(
					"resource_type", "image"
			));
			log.info("Deleted Cloudinary file: {} => {}", publicId, result);
		} catch (IOException e) {
			log.error("Delete error: {}", publicId, e);
			throw new RuntimeException("Cloudinary delete failed");
		}
	}

	/**
	 * Tải về danh sách URL của tất cả ảnh trong một folder
	 */
	public List<String> downloadFiles(String folderPath) {
		try {
			ApiResponse result = cloudinary.api().resourcesByAssetFolder(folderPath,
					ObjectUtils.asMap("fields", "secure_url") // Chỉ lấy secure_url
					);

			List<Map<String, Object>> resources = (List<Map<String, Object>>) result.get("resources");
			List<String> urls = new ArrayList<>();
			for (Map<String, Object> res : resources) {
				urls.add((String) res.get("secure_url"));
			}
			return urls;

		} catch (Exception e) {
			log.error("Failed to fetch folder {}: {}", folderPath, e.getMessage());
			throw new RuntimeException("Cloudinary folder search failed");
		}
	}
}
