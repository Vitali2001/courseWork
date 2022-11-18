package org.example.dto.OrderDto;

import lombok.Data;

@Data
public class OrderCreateDTO {
    private String name;
    private String fromRegion;
    private String fromCity;
    private String fromAddress;
    private String toRegion;
    private String toCity;
    private String toAddress;
    private String weight;
    private String image;
    private Double price;
    private String emailCustomer;
    private String recaptchaToken;


}
