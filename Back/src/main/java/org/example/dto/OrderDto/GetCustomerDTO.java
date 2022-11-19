package org.example.dto.OrderDto;

import lombok.Data;

@Data
public class GetCustomerDTO {
    private String image;
    private String lastName;
    private String firstName;
    private String middleName;
    private String email;
    private String phone;

    public GetCustomerDTO(String image, String lastName, String firstName, String middleName, String email, String phone) {
        this.image = image;
        this.lastName = lastName;
        this.firstName = firstName;
        this.middleName = middleName;
        this.email = email;
        this.phone = phone;
    }
}
