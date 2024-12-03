package com.se.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class UpdateBuyerInformationRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String sex;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate DOB;
}
