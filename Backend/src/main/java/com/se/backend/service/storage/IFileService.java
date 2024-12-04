package com.se.backend.service.storage;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IFileService {
	void uploadFile(MultipartFile file, FileInfo fileInfo);

	ResponseEntity<String> downloadFile(FileInfo fileInfo);
	void deleteFile(FileInfo fileInfo);
	List<FileInfo> listFiles(String folder);
}
