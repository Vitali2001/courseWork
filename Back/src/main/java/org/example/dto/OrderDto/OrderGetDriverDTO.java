package org.example.dto.OrderDto;

import lombok.Data;

@Data
public class OrderGetDriverDTO {
    private String email;
    private String recaptchaToken;
}
