package org.example.dto.OrderDto;

import lombok.Data;

@Data
public class OrderIsUserDTO {
    private int id;
    private String emailDriver;
    private String recaptchaToken;
}
