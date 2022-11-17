package org.example.web;

import io.swagger.annotations.Api;
import lombok.RequiredArgsConstructor;
import org.example.configuration.captcha.CaptchaSettings;
import org.example.dto.OrderDto.OrderGetDTO;
import org.example.entity.OrderEntity;
import org.example.mapper.ApplicationMapper;
import org.example.repositories.OrderRepository;
import org.example.repositories.RoleRepository;
import org.example.repositories.UserRepository;
import org.example.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestOperations;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "api/orders")
@Api(tags = "Замовлення")
public class OrderController {
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
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
}
