package org.example.dto.OrderDto;

import lombok.Data;

import java.util.Date;

@Data
public class OrderSetDriverDTO {
    public int id;
    public String email;
    public Date date;
    public String recaptchaToken;
}
