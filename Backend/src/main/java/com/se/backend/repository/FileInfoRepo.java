package com.se.backend.repository;

import com.se.backend.entity.FileInfo;
import com.se.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileInfoRepo extends JpaRepository<FileInfo, String> {
	FileInfo findByFileName(String fileName);
	List<FileInfo> findFileInfoByProduct(Product product);
}
