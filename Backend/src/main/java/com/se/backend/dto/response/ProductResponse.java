package com.se.backend.dto.response;

import com.se.backend.entity.Admin;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductResponse {
    private String id;
    private String name;
    private String description;
    private String categoryName;
    private List<Admin> attributes;
    private String sellerName;
    private List<Admin> adminNames;
}
