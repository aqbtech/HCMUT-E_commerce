package com.se.backend.dto.request;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class FilterProductRequest {
    private  List<String> categories;//Ex: ["Men"]
    private List<String> locations;//Ex: ["HoChiMinh", "HaNoi"]
    private List<String> ratings;//Ex: ["1-2", "2-3"]
}
