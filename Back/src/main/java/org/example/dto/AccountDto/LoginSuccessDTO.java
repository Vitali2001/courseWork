package org.example.dto.AccountDto;

import lombok.Data;

@Data
public class LoginSuccessDTO {
    private String username;
    private String token;
}
