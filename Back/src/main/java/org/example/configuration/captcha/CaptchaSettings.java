package org.example.configuration.captcha;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "recaptcha")
public class CaptchaSettings {
    //reCAPTCHA V3
    private String sitekey;
    private String secretkey;
}

