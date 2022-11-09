package org.example.dto.UserDto;

import lombok.Data;
import org.example.entity.RoleEntity;

@Data
public class UserItemDTO {
    private String email;
    private String phone;
    private String password;
    private String LastName;
    private String FirstName;
    private String MiddleName;
    private String Address;
    private RoleEntity role;
    private String image;

}
