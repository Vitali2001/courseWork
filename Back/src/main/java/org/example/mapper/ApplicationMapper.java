package org.example.mapper;

import org.example.dto.UserDto.UserCreateDTO;
import org.example.dto.UserDto.UserItemDTO;
import org.example.dto.UserDto.UserUpdateSuccessDTO;
import org.example.entity.UserEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ApplicationMapper {
    List<UserItemDTO> userToUserItemDto_List(List<UserEntity> users);
    UserEntity userCreateDtoToUserEntity(UserCreateDTO user);
}
