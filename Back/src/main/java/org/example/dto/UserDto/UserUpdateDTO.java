package org.example.dto.UserDto;

import lombok.Data;

@Data
public class UserUpdateDTO {
    private String email;
    private String phone;
    private String lastName;
    private String firstName;
    private String middleName;
    private String address;
    private String image;
    private String recaptchaToken;
}
