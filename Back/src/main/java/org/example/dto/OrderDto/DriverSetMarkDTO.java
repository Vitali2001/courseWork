package org.example.dto.OrderDto;

import lombok.Data;

@Data
public class DriverSetMarkDTO {
    private int id;
    private int mark;
    private String email;
    private String recaptchaToken;
}
