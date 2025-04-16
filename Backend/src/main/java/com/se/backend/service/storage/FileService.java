package com.se.backend.service.storage;


import com.se.backend.entity.FileInfo;
import com.se.backend.entity.Product;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.repository.FileInfoRepo;
import com.se.backend.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class FileService implements IFileService {
	private final FileDAO fileDAO;
	private final FileInfoRepo fileInfoRepo;
	private final ProductRepository productRepository;

	@Autowired
	public FileService(FileDAO fileDAO, FileInfoRepo fileInfoRepo, ProductRepository productRepository) {
		this.fileDAO = fileDAO;
		this.fileInfoRepo = fileInfoRepo;
		this.productRepository = productRepository;
	}
	@Override
	@Transactional
	public void uploadFile(MultipartFile file, FileInfo fileInfo) {
		try {
			Product p = productRepository.findProductSummaryById(fileInfo.getFolder());
			fileInfo.addProduct(p);
			fileInfoRepo.save(fileInfo);
			fileDAO.uploadFile(file, fileInfo);
		} catch (Exception e) {
			throw new WebServerException(ErrorCode.UNKNOWN_ERROR);
		}
	}

	@Override
	public ResponseEntity<String> downloadFile(FileInfo fileInfo) {
		String url = fileDAO.downloadFile(fileInfo);
		return ResponseEntity.ok(url);
	}
	@Override
	public void deleteFile(FileInfo fileInfo) {
		fileDAO.deleteFile(fileInfo);
	}

	@Override
	public List<String> listFiles(String folder) {
		return fileDAO.downloadFiles(folder);
	}
}
