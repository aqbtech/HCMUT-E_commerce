package com.se.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
public class UserSellerRegister {
    @Size(min = 8, max = 20, message = "Username must be between 8 and 20 characters")
    private String username;
    @Size(min = 8, max = 20, message = "Password must be between 8 and 20 characters")
    private String password;
    @Email
    private String email;
    @Size(min = 10, max = 10, message = "Phone number must be 10 digits")
    private String phone;
    @NotBlank
    private String shopName;
    @NotBlank
    private String province;
    @NotBlank
    private String district;
    @NotBlank
    private String ward;
    @NotBlank
    private String detailAddress;
}
