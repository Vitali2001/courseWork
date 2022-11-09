package org.example.dto.UserDto;

import lombok.Data;

@Data
public class UserChangePasswordDTO {
    private String email;
    private String oldPassword;
    private String newPassword;
    private String recaptchaToken;
}
