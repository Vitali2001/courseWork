package org.example.dto.UserDto;

import lombok.Data;
import org.example.entity.RoleEntity;
@Data
public class UserGetDTO {
    private String email;
    private String phone;
    private String LastName;
    private String FirstName;
    private String MiddleName;
    private String Address;
    private String role;
    private String image;
    private int raiting;

    public UserGetDTO(String email, String phone, String lastName, String firstName, String middleName, String address, String role, String image,int raiting) {
        this.email = email;
        this.phone = phone;
        LastName = lastName;
        FirstName = firstName;
        MiddleName = middleName;
        Address = address;
        this.role = role;
        this.image = image;
        this.raiting = raiting;
    }
}
