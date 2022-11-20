package org.example.dto.OrderDto;

import lombok.Data;

@Data
public class OrderDeleteDTO {
    private int id;
    private String recaptchaToken;
}
