package com.se.backend.controller;

import com.se.backend.dto.response.ResponseAPITemplate;
import com.se.backend.entity.FileInfo;
import com.se.backend.service.storage.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class ImgApi {
	private final FileService fileService;

	@PostMapping("/upload")
	public ResponseEntity<ResponseAPITemplate<?>> uploadFile(@RequestParam(value = "file") MultipartFile file,
															 @RequestParam("productId") String productId) {
		FileInfo fileInfo = new FileInfo(productId, file.getOriginalFilename());
		fileService.uploadFile(file, fileInfo);
		// call service to save file path to product
		return ResponseEntity.ok(ResponseAPITemplate.builder().build());
	}

	@GetMapping("/download/{productId}/{fileName}")
	public ResponseEntity<String> downloadFile(@PathVariable String productId, @PathVariable String fileName) {
		FileInfo fileInfo = new FileInfo(productId, fileName);
		return fileService.downloadFile(fileInfo);
	}
	@GetMapping("/folder")
	public ResponseEntity<?> listFiles(@RequestParam("folder") String folder) {
		return ResponseEntity.ok(fileService.listFiles(folder));
	}
}
