package org.example.dto.UserDto;

import lombok.Data;
import org.example.entity.RoleEntity;

@Data
public class UserDeleteDTO {
    private String email;
    private String recaptchaToken;
}
