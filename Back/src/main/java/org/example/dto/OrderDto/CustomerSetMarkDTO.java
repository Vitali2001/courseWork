package org.example.dto.OrderDto;

import lombok.Data;

@Data
public class CustomerSetMarkDTO {
    private int id;
    private int mark;
    private String email;
    private String recaptchaToken;
}
