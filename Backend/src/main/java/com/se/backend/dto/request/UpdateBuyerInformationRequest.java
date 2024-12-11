package com.se.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class UpdateBuyerInformationRequest {
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @Email
    private String email;
    @Size(min = 10, max = 10, message = "Phone number must be 10 digits")
    private String phone;
    private String sex;
    @Past
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate DOB;
}
