package org.example.web;

import io.swagger.annotations.Api;
import lombok.RequiredArgsConstructor;
import org.example.configuration.captcha.CaptchaSettings;
import org.example.configuration.captcha.GoogleResponse;
import org.example.configuration.security.JwtTokenUtil;
import org.example.constants.Roles;
import org.example.dto.AccountDto.LoginDTO;
import org.example.dto.AccountDto.LoginSuccessDTO;
import org.example.dto.UserDto.*;
import org.example.entity.UserEntity;
import org.example.mapper.ApplicationMapper;
import org.example.repositories.RoleRepository;
import org.example.repositories.UserRepository;
import org.example.services.UserService;
import org.example.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestOperations;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "api/account")
@Api(tags = "Акаунт")
public class AccountController {
    private final StorageService storageService;
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CaptchaSettings captchaSettings;
    @Autowired
    private final RestOperations restTemplate;
    private final ApplicationMapper mapper;

    protected static final String RECAPTCHA_URL_TEMPLATE = "https://www.google.com/recaptcha/api/siteverify?secret=%s&response=%s";
    @PostMapping("/login")
    public ResponseEntity<LoginSuccessDTO> login(@RequestBody LoginDTO loginDto) {
        try {
            String url = String.format(RECAPTCHA_URL_TEMPLATE, captchaSettings.getSecretkey(), loginDto.getRecaptchaToken());
            try {
                final GoogleResponse googleResponse = restTemplate.getForObject(url, GoogleResponse.class);
                if (!googleResponse.isSuccess()) {
                    throw new Exception("reCaptcha was not successfully validated");
                }
            }
            catch (Exception rce) {
                String str = rce.getMessage();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            LoginSuccessDTO loginUser = loginUser(loginDto.getEmail(), loginDto.getPassword());
            return ResponseEntity.ok()
                    .body(loginUser);
        }catch(BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    @PostMapping("/register")
    public String Register(@RequestBody UserCreateDTO user)
    {
        try {
            String url = String.format(RECAPTCHA_URL_TEMPLATE, captchaSettings.getSecretkey(), user.getRecaptchaToken());
            try {
                final GoogleResponse googleResponse = restTemplate.getForObject(url, GoogleResponse.class);
                if (!googleResponse.isSuccess()) {
                    throw new Exception("reCaptcha was not successfully validated");
                }
            }
            catch (Exception rce) {
                String str = rce.getMessage();
            }
            List<UserItemDTO> users = mapper.userToUserItemDto_List(userRepository.findAll());
            boolean isUser = false;
            String emailUser = user.getEmail();
            for(UserItemDTO item: users)
            {
                String itemEmail = item.getEmail();
                if(itemEmail.equals(emailUser))
                {
                    isUser = true;
                }
            }
            if(isUser)
            {
                return "Данний користувач вже є в системі";
            }
            else
            {
                PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
                UserEntity userEntity = mapper.userCreateDtoToUserEntity(user);
                String fileName = storageService.store(user.getImage());
                userEntity.setImage(fileName);
                userEntity.setRole(roleRepository.findByName(user.getRole().toString()));
                userEntity.setPassword(encoder.encode(user.getPassword()));
                userRepository.save(userEntity);
                return "Користувача додано";
            }

        }catch(BadCredentialsException ex) {
            return "404";
        }
    }
    @PostMapping("/update")
    public UserUpdateSuccessDTO UpdateUser(@RequestBody UserUpdateDTO userUp)
    {
        UserUpdateSuccessDTO userSuccess = new UserUpdateSuccessDTO();
        try {
            String url = String.format(RECAPTCHA_URL_TEMPLATE, captchaSettings.getSecretkey(), userUp.getRecaptchaToken());
            try {
                final GoogleResponse googleResponse = restTemplate.getForObject(url, GoogleResponse.class);
                if (!googleResponse.isSuccess()) {
                    throw new Exception("reCaptcha was not successfully validated");
                }
            }
            catch (Exception rce) {
                String str = rce.getMessage();
            }
            UserEntity user = userRepository.findByEmail(userUp.getEmail());
            if(user == null)
            {
                return userSuccess;
            }
            else
            {
                if(!userUp.getImage().equals(""))
                {
                    String img = user.getImage();
                    storageService.removeFile(img);
                    String fileName = storageService.store(userUp.getImage());
                    user.setImage(fileName);
                }
                user.setAddress(userUp.getAddress());
                user.setLastName(userUp.getLastName());
                user.setFirstName(userUp.getFirstName());
                user.setMiddleName(userUp.getMiddleName());
                user.setPhone(userUp.getPhone());
                userRepository.save(user);
               userSuccess.setId(user.getId());
                userSuccess.setImage(user.getImage());
                userSuccess.setAddress(user.getAddress());
                userSuccess.setRole(user.getRole().toString());
                userSuccess.setEmail(user.getEmail());
                userSuccess.setFirstName(user.getFirstName());
                userSuccess.setPhone(user.getPhone());
                userSuccess.setLastName(user.getLastName());
                userSuccess.setMiddleName(user.getMiddleName());
                /*userSuccess = mapper.userEntityToUserUpdateSuccessDTO(user);*/
                return userSuccess;
            }

        }catch(BadCredentialsException ex) {
            return userSuccess;
        }
    }
    @PostMapping("/changePassword")
    public String ChangePassword(@RequestBody UserChangePasswordDTO userChange)
    {
        try {
            String url = String.format(RECAPTCHA_URL_TEMPLATE, captchaSettings.getSecretkey(), userChange.getRecaptchaToken());
            try {
                final GoogleResponse googleResponse = restTemplate.getForObject(url, GoogleResponse.class);
                if (!googleResponse.isSuccess()) {
                    throw new Exception("reCaptcha was not successfully validated");
                }
            }
            catch (Exception rce) {
                String str = rce.getMessage();
            }
            PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();

            UserEntity user = userRepository.findByEmail(userChange.getEmail());
            String oldPass = encoder.encode(userChange.getOldPassword());
            String newPass = encoder.encode(userChange.getNewPassword());
            if(!encoder.matches(userChange.getOldPassword(),user.getPassword()))
            {
                return "Старий пароль введено не вірно!";
            }
            else
            {
                user.setPassword(newPass);
                userRepository.save(user);
                return "Ok";
            }

        }catch(BadCredentialsException ex) {
            return ex.getMessage();
        }
    }
    private LoginSuccessDTO loginUser(String username,String password) throws BadCredentialsException{
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username,password));

        User user = (User)authentication.getPrincipal();
        UserEntity dbUser = userRepository.findByEmail(username);
        LoginSuccessDTO loginSuccessDTO = new LoginSuccessDTO();
        loginSuccessDTO.setUsername(dbUser.getEmail());
        loginSuccessDTO.setToken(jwtTokenUtil.generateAccessToken(dbUser));

        return loginSuccessDTO;
    }
    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) throws Exception {

        Resource file = storageService.loadAsResource(filename);
        String urlFileName =  URLEncoder.encode("image.jpg", StandardCharsets.UTF_8.toString());
        return ResponseEntity.ok()
                //.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
                .contentType(MediaType.IMAGE_JPEG)
                .header(HttpHeaders.CONTENT_DISPOSITION,"filename=\""+urlFileName+"\"")
                .body(file);
    }
}
