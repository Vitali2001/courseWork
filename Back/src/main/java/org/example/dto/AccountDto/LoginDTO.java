package org.example.dto.AccountDto;

import lombok.Data;

@Data
public class LoginDTO {
    private String email;

    private String password;

    private String recaptchaToken;
}