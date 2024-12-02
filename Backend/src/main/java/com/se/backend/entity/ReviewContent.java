package com.se.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "review_content")
	public class ReviewContent {
		@Id
		@GeneratedValue(strategy = GenerationType.UUID)
		@Column(name = "root_review_content_id")
		private String reviewId;
		private String content;
		private Double rating;
		private String replyContent;

		// -- Relationships -- //
		// mapping with seller
		@ManyToOne
		@JoinColumn(name = "seller_id", referencedColumnName = "username")
		private Seller seller;
		private String sellerReplyContent;
		// mapping with Review
		@OneToOne(mappedBy = "reviewContent")
		private Review review;
	}
