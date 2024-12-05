package com.se.backend.repository;

import com.se.backend.entity.FileInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileInfoRepo extends JpaRepository<FileInfo, String> {
	FileInfo findByFileName(String fileName);
}
