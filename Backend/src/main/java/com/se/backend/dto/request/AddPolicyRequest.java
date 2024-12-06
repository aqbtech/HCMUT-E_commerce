package com.se.backend.dto.request;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class AddPolicyRequest {
    private String type;
    private List<String> target;
    private LocalDate apply_date;
    private String policy_description;
    private String policy_name;
    private LocalDate release_date;
    private Double sale;
    private int count;
}
