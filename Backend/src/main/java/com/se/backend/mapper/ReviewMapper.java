package com.se.backend.mapper;

import com.se.backend.dto.response.ReviewDetail;
import com.se.backend.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
	@Mapping(target = "reviewId", source = "reviewId.reviewContentId")
	@Mapping(target = "reviewerName", source = "buyer.username")
	@Mapping(target = "reviewContent", source = "reviewContent.content")
	@Mapping(target = "rating", source = "reviewContent.rating")
	ReviewDetail toReviewDetail(Review review);
}
