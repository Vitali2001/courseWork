package org.example.web;


import io.swagger.annotations.Api;
import lombok.RequiredArgsConstructor;
import org.example.configuration.captcha.CaptchaSettings;
import org.example.configuration.captcha.GoogleResponse;
import org.example.constants.Roles;
import org.example.dto.UserDto.*;
import org.example.entity.OrderEntity;
import org.example.entity.RoleEntity;
import org.example.entity.UserEntity;
import org.example.mapper.ApplicationMapper;
import org.example.repositories.OrderRepository;
import org.example.repositories.RoleRepository;
import org.example.repositories.UserRepository;
import org.example.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestOperations;

import java.util.ArrayList;
import java.util.List;

import static org.example.web.AccountController.RECAPTCHA_URL_TEMPLATE;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "api/users")
@Api(tags = "Користувачі")
public class UserController {
    private final UserRepository userRepository;
    @Autowired
    private OrderRepository orderRepository;
    private final RoleRepository roleRepository;
    private final ApplicationMapper mapper;
    private final CaptchaSettings captchaSettings;
    @Autowired
    private final RestOperations restTemplate;
    private final StorageService storageService;

    @GetMapping("/drivers")
    public List<UserGetDTO> getDrivers()
    {
        List<UserGetDTO> drivers = new ArrayList<UserGetDTO>();
        RoleEntity role = roleRepository.findByName("driver");
        List<UserItemDTO> users = mapper.userToUserItemDto_List(userRepository.findAll());
        for(UserItemDTO item : users)
        {
            if(item.getRole().toString().equals(role.toString()))
            {
                int raiting = 0;
                UserEntity entity = userRepository.findByEmail(item.getEmail());
                List<Integer> marks = entity.getRaiting();
                if(marks != null)
                {
                    for(Integer m: marks)
                        raiting += m;
                    raiting = raiting / marks.size();
                }
                UserGetDTO user = new UserGetDTO(item.getEmail(), item.getPhone(), item.getLastName(),
                        item.getFirstName(),item.getMiddleName(),item.getAddress(),
                        item.getRole().toString(), item.getImage(),raiting);
                drivers.add(user);
            }
        }
        return drivers;
    }
    @GetMapping("/customers")
    public List<UserGetDTO> getCustomers()
    {
        List<UserGetDTO> customers = new ArrayList<UserGetDTO>();
        RoleEntity role = roleRepository.findByName("customer");
        List<UserItemDTO> users = mapper.userToUserItemDto_List(userRepository.findAll());
        for(UserItemDTO item : users)
        {
            if(item.getRole().toString().equals(role.toString()))
            {
                int raiting = 0;
                UserEntity entity = userRepository.findByEmail(item.getEmail());
                List<Integer> marks = entity.getRaiting();
                if(marks != null)
                {
                    for(Integer m: marks)
                        raiting += m;
                    raiting = raiting / marks.size();
                }
                UserGetDTO user = new UserGetDTO(item.getEmail(), item.getPhone(), item.getLastName(),
                        item.getFirstName(),item.getMiddleName(),item.getAddress(),
                        item.getRole().toString(), item.getImage(),raiting);
                customers.add(user);
            }
        }
        return customers;

    }
    @PostMapping("/addUser")
    public String AddUser(@RequestBody UserCreateDTO user)
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
    @PostMapping("/updateUser")
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
                    storageService.removeFile(user.getImage());
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
                return userSuccess;
            }

        }catch(BadCredentialsException ex) {
            return userSuccess;
        }
    }
    @PostMapping("/deleteUser")
    public String DeleteUser(@RequestBody UserDeleteDTO userDel)
    {
        UserUpdateSuccessDTO userSuccess = new UserUpdateSuccessDTO();
        try {
            String url = String.format(RECAPTCHA_URL_TEMPLATE, captchaSettings.getSecretkey(), userDel.getRecaptchaToken());
            try {
                final GoogleResponse googleResponse = restTemplate.getForObject(url, GoogleResponse.class);
                if (!googleResponse.isSuccess()) {
                    throw new Exception("reCaptcha was not successfully validated");
                }
            }
            catch (Exception rce) {
                String str = rce.getMessage();
            }
            UserEntity user = userRepository.findByEmail(userDel.getEmail());
            RoleEntity role = new RoleEntity();
            role.setName(Roles.Driver);
            if(user.getRole().getName().equals(role.getName()))
            {
                try{
                    storageService.removeFile(user.getImage());
                    List<OrderEntity> orders = user.getOrdersDrivers();
                    if(orders != null)
                    {
                        for(OrderEntity item: orders)
                        {
                            item.setDriver(null);
                            orderRepository.save(item);
                        }
                    }
                    storageService.removeFile(user.getImage());
                    userRepository.delete(user);
                    return "Користувача було видалено!";
                }
                catch (Exception ex)
                {
                    return "404";
                }
            }
            role.setName(Roles.Customer);
            if(user.getRole().getName().equals(role.getName()))
            {
                try{
                    storageService.removeFile(user.getImage());
                    List<OrderEntity> orders = user.getOrdersCustomers();
                    if(orders != null)
                    {
                        for(OrderEntity item: orders)
                        {
                            storageService.removeFile(item.getImage());
                            orderRepository.delete(item);
                        }
                    }
                    storageService.removeFile(user.getImage());
                    userRepository.delete(user);
                    return "Користувача було видалено!";
                }
                catch (Exception ex)
                {
                    return "404";
                }
            }
            else
                return "404";

        }catch(BadCredentialsException ex) {
            return "404";
        }
    }
}