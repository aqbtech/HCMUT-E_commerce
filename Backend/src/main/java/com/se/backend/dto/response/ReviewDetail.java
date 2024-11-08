package com.se.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ReviewDetail {
	private String reviewId;
	private String reviewerName;
	private String reviewContent;
	private Double rating;
}
