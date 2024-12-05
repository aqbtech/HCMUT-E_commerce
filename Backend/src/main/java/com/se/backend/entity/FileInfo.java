package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class FileInfo {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String folder;
	private String fileName;

	// -- mapping relationships --
	// mapping product_imgs
	@ManyToOne(cascade = CascadeType.PERSIST,fetch = FetchType.LAZY)
	@JoinColumn(name = "product_id", referencedColumnName = "root_product_id")
	private Product product;

	public FileInfo(String folder, String fileName) {
		this.folder = folder;
		this.fileName = fileName;
	}

	public void addProduct(Product product) {
		this.product = product;
		product.getProductImgs().add(this);
	}
}
