package com.se.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class BuyerInformationResopnse {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String sex;
    private LocalDate DOB;
}
