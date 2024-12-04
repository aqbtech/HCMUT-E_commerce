package com.se.backend.service.storage;

import com.se.backend.entity.FileInfo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IFileService {
	void uploadFile(MultipartFile file, FileInfo fileInfo);

	ResponseEntity<String> downloadFile(FileInfo fileInfo);
	void deleteFile(FileInfo fileInfo);
	List<String> listFiles(String folder);
}
