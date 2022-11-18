package org.example.web;

import io.swagger.annotations.Api;
import lombok.RequiredArgsConstructor;
import org.example.configuration.captcha.CaptchaSettings;
import org.example.configuration.captcha.GoogleResponse;
import org.example.dto.OrderDto.OrderCreateDTO;
import org.example.dto.OrderDto.OrderGetDTO;
import org.example.dto.OrderDto.OrderIsUserDTO;
import org.example.dto.OrderDto.OrderSetDriverDTO;
import org.example.dto.UserDto.UserCreateDTO;
import org.example.dto.UserDto.UserItemDTO;
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
import java.util.Arrays;
import java.util.List;

import static org.example.web.AccountController.RECAPTCHA_URL_TEMPLATE;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "api/orders")
@Api(tags = "Замовлення")
public class OrderController {
    private final UserRepository userRepository;
    @Autowired
    private OrderRepository orderRepository;
    private final ApplicationMapper mapper;
    private final CaptchaSettings captchaSettings;
    @Autowired
    private final RestOperations restTemplate;
    private final StorageService storageService;

    @GetMapping("/NotAcceptedOrders")
    public List<OrderGetDTO> getOrders()
    {
        List<OrderEntity> orders = orderRepository.findAll();
        List<OrderGetDTO> ordersDto = new ArrayList<OrderGetDTO>();
        for (OrderEntity item : orders)
        {
            if(item.getDriver() == null)
            {
                OrderGetDTO order = new OrderGetDTO(item.getId(), item.getName(), item.getFromRegion(),
                        item.getFromCity(), item.getFromAddress(),item.getToRegion(),item.getToCity(),
                        item.getToAddress(),item.getWeight(),item.getImage(),item.getPrice(),
                        item.getCustomer().getEmail());
                ordersDto.add(order);
            }
        }
        return ordersDto;
    }
    @PostMapping("/addOrder")
    public String AddUser(@RequestBody OrderCreateDTO order)
    {
        try {
            String url = String.format(RECAPTCHA_URL_TEMPLATE, captchaSettings.getSecretkey(), order.getRecaptchaToken());
            try {
                final GoogleResponse googleResponse = restTemplate.getForObject(url, GoogleResponse.class);
                if (!googleResponse.isSuccess()) {
                    throw new Exception("reCaptcha was not successfully validated");
                }
            }
            catch (Exception rce) {
                String str = rce.getMessage();
            }
            UserEntity user = userRepository.findByEmail(order.getEmailCustomer());
            String fileName = storageService.store(order.getImage());
            OrderEntity orderEntity = new OrderEntity(order.getFromRegion(),order.getName(),
                        order.getFromCity(),order.getFromAddress(),order.getToRegion(),
                        order.getToCity(),order.getToAddress(),order.getWeight(),fileName,
                        order.getPrice(),user);
                this.orderRepository.save(orderEntity);
                return "Замовлення створено";
        }catch(BadCredentialsException ex) {
            return "404";
        }
    }
    @PostMapping("/verifyDriver")
    public String VerifyDriver(@RequestBody OrderIsUserDTO order)
    {
        try {
            String url = String.format(RECAPTCHA_URL_TEMPLATE, captchaSettings.getSecretkey(), order.getRecaptchaToken());
            try {
                final GoogleResponse googleResponse = restTemplate.getForObject(url, GoogleResponse.class);
                if (!googleResponse.isSuccess()) {
                    throw new Exception("reCaptcha was not successfully validated");
                }
            }
            catch (Exception rce) {
                String str = rce.getMessage();
            }
            UserEntity user = userRepository.findByEmail(order.getEmailDriver());
            List<OrderEntity> orders = user.getOrdersDrivers();
            if(orders.size()>0)
            {
                return "no";
            }
            else
            {
                return "ok";
            }
        }catch(BadCredentialsException ex) {
            return "404";
        }
    }
    @PostMapping("/setDriverOrder")
    public String SetOrder(@RequestBody OrderSetDriverDTO order)
    {
        try {
            String url = String.format(RECAPTCHA_URL_TEMPLATE, captchaSettings.getSecretkey(), order.getRecaptchaToken());
            try {
                final GoogleResponse googleResponse = restTemplate.getForObject(url, GoogleResponse.class);
                if (!googleResponse.isSuccess()) {
                    throw new Exception("reCaptcha was not successfully validated");
                }
            }
            catch (Exception rce) {
                String str = rce.getMessage();
            }
            UserEntity driver = userRepository.findByEmail(order.getEmail());
            OrderEntity orderEntity = orderRepository.findById(order.getId());
            orderEntity.setDownloadDate(order.getDate());
            List<OrderEntity> orders = new ArrayList<>();
            driver.setOrdersCustomers(orders);
            userRepository.save(driver);
            orderEntity.setDriver(driver);
            orderRepository.save(orderEntity);
            return "ok";
        }catch(BadCredentialsException ex) {
            return "404";
        }
    }
}
