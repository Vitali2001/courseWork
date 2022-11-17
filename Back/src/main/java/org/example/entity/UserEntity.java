package org.example.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name="tblUsers")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(length = 100, nullable = false)
    private String email;
    @Column(length = 20, nullable = false)
    private String phone;
    @Column(length = 150, nullable = false)
    private String password;
    @Column(length = 100)
    private String image;
    @Column(length = 100,nullable = false)
    private String LastName;
    @Column(length = 100,nullable = false)
    private String FirstName;
    @Column(length = 100,nullable = false)
    private String MiddleName;
    @Column(length = 100,nullable = false)
    private String Address;

    @ManyToOne
    @JoinColumn(name = "role_id",nullable = false)
    private RoleEntity role;
    @OneToMany(mappedBy = "customer")
    private List<OrderEntity> ordersCustomers;
    @OneToMany(mappedBy = "driver")
    private List<OrderEntity> ordersDrivers;
}
