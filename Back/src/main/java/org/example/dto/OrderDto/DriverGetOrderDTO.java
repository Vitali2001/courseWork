package org.example.dto.OrderDto;

import lombok.Data;

import java.util.Date;

@Data
public class DriverGetOrderDTO {
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

    public DriverGetOrderDTO()
    {

    }
    public DriverGetOrderDTO(Integer id, String name, String fromRegion, String fromCity, String fromAddress, String toRegion, String toCity, String toAddress, String weight, String image, Double price,Date date,int customerMark,int driverMark) {
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
    }


}
