package org.example.dto.UserDto;

import lombok.Data;
import org.example.entity.RoleEntity;

@Data
public class UserCreateDTO {
    private String email;
    private String phone;
    private String password;
    private String lastName;
    private String firstName;
    private String middleName;
    private String address;
    private RoleEntity role;
    private String image;
    private String recaptchaToken;
}
