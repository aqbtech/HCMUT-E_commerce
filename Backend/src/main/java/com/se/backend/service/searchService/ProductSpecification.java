package com.se.backend.service.searchService;

import com.se.backend.entity.*;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> hasCategories(List<String> categoryNames) {
        return (root, query, criteriaBuilder) -> {
            if (categoryNames == null || categoryNames.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return root.get("category").get("richTextName").in(categoryNames);//Danh mục
        };
    }

    public static Specification<Product> hasLocation(List<String> provinces) {
        return (root, query, criteriaBuilder) -> {
            if (provinces == null || provinces.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return root.get("seller").get("address").get("province").in(provinces);//Tỉnh
        };
    }

    public static Specification<Product> hasRatingIn(List<String> ratingRanges) {
        return (root, query, criteriaBuilder) -> {
            if (ratingRanges == null || ratingRanges.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            // Join
            Join<Product, BuildProduct> buildProductJoin = root.join("buildProduct", JoinType.LEFT);
            Join<BuildProduct, ProductInstance> productInstanceJoin = buildProductJoin.join("productInstance", JoinType.LEFT);
            Join<ProductInstance, Review> reviewJoin = productInstanceJoin.join("review", JoinType.LEFT);
            Join<Review, ReviewContent> reviewContentJoin = reviewJoin.join("reviewContent", JoinType.LEFT);

            // Tạo rating
            List<Predicate> predicates = new ArrayList<>();
            for (String range : ratingRanges) {
                String[] bounds = range.split("-");
                if (bounds.length == 2) {
                    try {
                        double lowerBound = Double.parseDouble(bounds[0]);
                        double upperBound = Double.parseDouble(bounds[1]);
                        Predicate ratingPredicate = criteriaBuilder.and(
                                criteriaBuilder.greaterThanOrEqualTo(criteriaBuilder.avg(reviewContentJoin.get("rating")), lowerBound),
                                criteriaBuilder.lessThanOrEqualTo(criteriaBuilder.avg(reviewContentJoin.get("rating")), upperBound)
                        );
                        predicates.add(ratingPredicate);
                    } catch (NumberFormatException e) {
                        //catch j giờ tr
                    }
                }
            }

            // Nếu có điều kiện rating, thêm nhóm điều kiện HAVING
            assert query != null;
            query.groupBy(root.get("id"));
            query.having(criteriaBuilder.or(predicates.toArray(new Predicate[0]))); // Thêm điều kiện HAVING cho rating

            return criteriaBuilder.conjunction(); // Thêm j nữa thì bổ sung :v
        };
    }
}
