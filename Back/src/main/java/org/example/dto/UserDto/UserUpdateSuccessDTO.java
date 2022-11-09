package org.example.dto.UserDto;

import lombok.Data;

import javax.persistence.Column;

@Data
public class UserUpdateSuccessDTO {
    private int id;
    private String email;
    private String phone;
    private String password;
    private String image;
    private String lastName;
    private String firstName;
    private String middleName;
    private String address;
    private String role;
}
