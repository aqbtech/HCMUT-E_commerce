package com.se.backend.dto.request;
import com.se.backend.entity.Admin;
import com.se.backend.entity.Attribute;
import com.se.backend.entity.BuildProduct;
import lombok.*;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductRequest {
    private String id;
    private String name;
    private String description;
    private String categoryName;
    private List<Attribute> attribute;
    private BuildProduct buildProduct;
    private String sellerUsername;
    private List<Admin> admin;
}
