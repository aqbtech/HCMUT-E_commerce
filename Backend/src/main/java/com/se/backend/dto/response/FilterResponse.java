package com.se.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class FilterResponse {
    private List<String> locations;
    private List<String> categories;
    private List<String> ratings;


}
