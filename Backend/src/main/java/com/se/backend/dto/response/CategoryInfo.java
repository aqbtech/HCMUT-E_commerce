package com.se.backend.dto.response;

import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class CategoryInfo {
	private Long id;
	private String richTextName;
	private String imageLink;
	private Long parentId;
	private List<CategoryInfo> children;
}
