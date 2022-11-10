package org.example.web;


import io.swagger.annotations.Api;
import lombok.RequiredArgsConstructor;
import org.example.dto.UserDto.UserGetDTO;
import org.example.dto.UserDto.UserItemDTO;
import org.example.entity.RoleEntity;
import org.example.entity.UserEntity;
import org.example.mapper.ApplicationMapper;
import org.example.repositories.RoleRepository;
import org.example.repositories.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "api/users")
@Api(tags = "Користувачі")
public class UserController {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ApplicationMapper mapper;

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
                    UserGetDTO user = new UserGetDTO(item.getEmail(), item.getPhone(), item.getLastName(),
                            item.getFirstName(),item.getMiddleName(),item.getAddress(),
                            item.getRole().toString(), item.getImage());
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
                UserGetDTO user = new UserGetDTO(item.getEmail(), item.getPhone(), item.getLastName(),
                        item.getFirstName(),item.getMiddleName(),item.getAddress(),
                        item.getRole().toString(), item.getImage());
                customers.add(user);
            }
        }
        return customers;

    }
}
