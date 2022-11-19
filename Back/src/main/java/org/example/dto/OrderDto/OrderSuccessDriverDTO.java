package org.example.dto.OrderDto;

import lombok.Data;

@Data
public class OrderSuccessDriverDTO {
    private String email;
    private int id;
    private int mark;
    private String recaptchaToken;
}
