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
    @Column(length = 100,nullable = false)
    private Double price;
    @Column(length = 5)
    private int driverMark;
    @Column(length = 5)
    private int customerMark;
    @Column(length = 100)
    private Date downloadDate;
    @ManyToOne
    @JoinColumn(name = "customer_id",nullable = false)
    private UserEntity customer;
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private UserEntity driver;

}
