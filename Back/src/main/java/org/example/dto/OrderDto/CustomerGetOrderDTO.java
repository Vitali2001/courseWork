package org.example.dto.OrderDto;

import lombok.Data;

import java.util.Date;

@Data
public class CustomerGetOrderDTO {
    private Integer id;
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
    private Date date;
    private int customerMark;
    private int driverMark;
    private String driverImage;
    private String lastName;
    private String firstName;
    private String middleName;
    private String email;
    private String phone;

    public CustomerGetOrderDTO()
    {

    }
    public CustomerGetOrderDTO(Integer id, String name, String fromRegion, String fromCity, String fromAddress, String toRegion, String toCity, String toAddress, String weight, String image, Double price, Date date, int customerMark, int driverMark, String driverImage, String lastName, String firstName, String middleName, String email, String phone) {
        this.id = id;
        this.name = name;
        this.fromRegion = fromRegion;
        this.fromCity = fromCity;
        this.fromAddress = fromAddress;
        this.toRegion = toRegion;
        this.toCity = toCity;
        this.toAddress = toAddress;
        this.weight = weight;
        this.image = image;
        this.price = price;
        this.date = date;
        this.customerMark = customerMark;
        this.driverMark = driverMark;
        this.driverImage = driverImage;
        this.lastName = lastName;
        this.firstName = firstName;
        this.middleName = middleName;
        this.email = email;
        this.phone = phone;
    }
}
