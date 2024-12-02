package com.se.backend.dto.request;

import lombok.*;

@Data
@Builder
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@AllArgsConstructor
public class ApiCategoryInfo {
	private Long id;
	private String richTextName;
	private String imageLink;
	private Long parentId;
}
