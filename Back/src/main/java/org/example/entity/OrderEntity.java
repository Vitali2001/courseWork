package org.example.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name="tbl_orders")
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(length = 100,nullable = false)
    private String fromRegion;
    @Column(length = 100,nullable = false)
    private String name;
    @Column(length = 100,nullable = false)
    private String fromCity;
    @Column(length = 100,nullable = false)
    private String fromAddress;
    @Column(length = 100,nullable = false)
    private String toRegion;
    @Column(length = 100,nullable = false)
    private String toCity;
    @Column(length = 100,nullable = false)
    private String toAddress;
    @Column(length = 100,nullable = false)
    private String weight;
    @Column(length = 100,nullable = false)
    private String image;
    @Column(nullable = false)
    private Double price;
    @Column(nullable = true)
    private int driverMark;
    @Column(nullable = true)
    private int customerMark;
    @Column(nullable = true)
    private Date downloadDate;
    @ManyToOne
    @JoinColumn(name = "customer_id",nullable = false)
    private UserEntity customer;
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private UserEntity driver;
    public OrderEntity()
    {

    }
    public OrderEntity(String fromRegion, String name, String fromCity, String fromAddress, String toRegion, String toCity, String toAddress, String weight, String image, Double price, UserEntity customer) {
        this.fromRegion = fromRegion;
        this.name = name;
        this.fromCity = fromCity;
        this.fromAddress = fromAddress;
        this.toRegion = toRegion;
        this.toCity = toCity;
        this.toAddress = toAddress;
        this.weight = weight;
        this.image = image;
        this.price = price;
        this.customer = customer;
    }
}
