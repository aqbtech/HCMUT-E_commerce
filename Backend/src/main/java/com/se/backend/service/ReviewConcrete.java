package com.se.backend.service;

import com.se.backend.dto.request.ReviewRequest;
import com.se.backend.dto.response.ReviewDetail;
import com.se.backend.dto.response.ReviewProductInstanceResponse;
import com.se.backend.dto.response.ReviewResponse;
import com.se.backend.entity.*;
import com.se.backend.exception.ErrorCode;
import com.se.backend.exception.WebServerException;
import com.se.backend.mapper.OrderReviewMapper;
import com.se.backend.mapper.ReviewMapper;
import com.se.backend.repository.*;
import com.se.backend.service.storage.FileService;
import com.se.backend.utils.PaginationUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.weaver.ast.Or;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewConcrete implements ReviewService {
	private final ReviewRepository reviewRepository;
	private final ProductRepository productRepository;
	private final ReviewMapper reviewMapper;
	private  final OrderRepository orderRepository;
	private final ReviewContentRepository reviewContentRepository;
	private final BuyerRepository buyerRepository;
	private final PaymentOrderRepository paymentOrderRepository;
	private  final ProductInstanceRepository productInstanceRepository;
	private final OrderReviewMapper orderReviewMapper;
	private final BuildProductRepository buildProductRepository;
	private final AttributeInsRepository attributeInsRepository;
	private final FileInfoRepo fileInfoRepo;
	private final FileService fileService;
	@Override
	public Double ratingCalculator(String productId) {
		var reviews = reviewRepository.findReviewByProductId(productRepository.findProductSummaryById(productId));
		AtomicReference<Double> result = new AtomicReference<>(0.0);
		reviews.stream().mapToDouble(r -> r.getReviewContent().getRating()).average().ifPresent(result::set);
		return result.get();
	}

	@Override
	public Page<ReviewDetail> getReviews(String productId, Pageable pageable) {
		Product p = productRepository.findProductSummaryById(productId);
		var pg = reviewRepository.findReviewByProductId(p);
		var listPg = reviewMapper.toReviewDetail(pg);
		return PaginationUtils.convertListToPage(listPg, pageable);
	}

	@Override
	public ReviewResponse reviewProduct(String username, ReviewRequest reviewRequest) {
		Buyer buyer = buyerRepository.findByUsername(username)
				.orElseThrow( () -> new IllegalArgumentException("Buyer not found"));

		Order order = orderRepository.findById(reviewRequest.getOrderId())
				.orElseThrow(() -> new IllegalArgumentException("Order not found"));

		ProductInstance productInstance = productInstanceRepository.findById(reviewRequest.getProductInstanceId())
				.orElseThrow(()-> new IllegalArgumentException("ProductInstance not found"));

		ReviewContent reviewContent = ReviewContent.builder()
				.content(reviewRequest.getComment())
				.rating(reviewRequest.getRating())
				.seller(order.getSeller())
				.build();
		reviewContentRepository.save(reviewContent);

		ReviewId reviewId = ReviewId.builder()
				.reviewContentId(reviewContent.getReviewId())
				.buyerUsername(username)
				.paymentOrderId(order.getPaymentOrder().getPaymentOrderCode())
				.productInstanceId(productInstance.getId())
				.build();

		Review review = Review.builder()
				.reviewContent(reviewContent)
				.buyer(buyer)
				.paymentOrder(order.getPaymentOrder())
				.productInstance(productInstance)
				.reviewId(reviewId)
				.build();
		reviewRepository.save(review);
		return ReviewResponse.builder()
				.msg("Review success")
				.build();
	}

	@Override
	public ReviewProductInstanceResponse getAllProductInstanceToReview(String username) {
		Buyer buyer = buyerRepository.findByUsername(username)
				.orElseThrow( () -> new IllegalArgumentException("Buyer not found"));
		List<Order> orderList = orderRepository.findOrdersByPaymentOrderDeliveryInforBuyer(buyer);
		List<Order> completedOrders = new ArrayList<>();
		List<ReviewProductInstanceResponse.OrderReview> orderReviewList = new ArrayList<>();
		for(int i = 0; i < orderList.size();i++) {
			if(Objects.equals(orderList.get(i).getStatus(), "COMPLETED")) {
				completedOrders.add(orderList.get(i));
			}
		}
		List<Order_ProductInstance> orderProductInstances = new ArrayList<>();
		for (Order order : completedOrders){
			for(Order_ProductInstance orderProductInstance : order.getOrderProductInstances()){
				orderProductInstances.add(orderProductInstance);
			}
		}
		for(Order_ProductInstance orderProductInstance : orderProductInstances){
			orderReviewList.add(handlerOrderListToOderReview(orderProductInstance));
		}

		return ReviewProductInstanceResponse.builder()
				.orderReivewList(orderReviewList)
				.build();
	}

	private ReviewProductInstanceResponse.OrderReview handlerOrderListToOderReview(Order_ProductInstance orderProductInstance) {
		ReviewProductInstanceResponse.OrderReview orderReview = orderReviewMapper.ORDER_REVIEW(orderProductInstance);
		ProductInstance productInstance = productInstanceRepository.findById(orderProductInstance.getOrder_productInstanceId().getProductInstanceId())
				.orElseThrow(() -> new IllegalArgumentException("ProductInstance not found"));
		List<BuildProduct> buildProducts = buildProductRepository.findByProductInstance(productInstance)
				.orElseThrow(() -> new IllegalArgumentException("BuildProduct not found"));
		String id = buildProducts.getFirst().getId().getProductId();
		String name = productRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Product not found")).getName();
		orderReview.setProductName(name);
		Product p = productRepository.findById(id)
				.orElseThrow(() -> new WebServerException(ErrorCode.PRODUCT_NOT_FOUND));
		FileInfo fileInfo = fileInfoRepo.findFileInfoByProduct(p).getFirst();
		String path = fileService.downloadFile(fileInfo).getBody();
		orderReview.setFirstImage(path);
		orderReview.setPrice(orderProductInstance.getQuantity() * orderProductInstance.getProductInstance().getPrice());

		List<AttributeInstance> attributeInstanceList = attributeInsRepository.findAttributeInstancesBy(orderProductInstance.getProductInstance());
		List<String> value = new ArrayList<>();
		for(AttributeInstance attributeInstance : attributeInstanceList){
			value.add(attributeInstance.getValue());
		}
		orderReview.setValue(value);

		PaymentOrder paymentOrder = orderProductInstance.getOrder().getPaymentOrder();
		Review review = reviewRepository.findReviewByPaymentOrderAndProductInstance(paymentOrder, productInstance);
		if(review == null){
			orderReview.setReview(false);
			orderReview.setReviewInfo(null);
		}
		else {
			orderReview.setReview(true);
			double rating = review.getReviewContent().getRating();
			String comment = review.getReviewContent().getContent();
			orderReview.setReviewInfo(new ReviewProductInstanceResponse.OrderReview.ReviewInfo(rating, comment));
		}
		return orderReview;
	}
}
