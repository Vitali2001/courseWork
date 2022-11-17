package org.example.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.Generated;
import org.example.dto.UserDto.UserCreateDTO;
import org.example.dto.UserDto.UserItemDTO;
import org.example.entity.UserEntity;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2022-11-17T16:29:15+0200",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 18.0.2 (Oracle Corporation)"
)
@Component
public class ApplicationMapperImpl implements ApplicationMapper {

    @Override
    public List<UserItemDTO> userToUserItemDto_List(List<UserEntity> users) {
        if ( users == null ) {
            return null;
        }

        List<UserItemDTO> list = new ArrayList<UserItemDTO>( users.size() );
        for ( UserEntity userEntity : users ) {
            list.add( userEntityToUserItemDTO( userEntity ) );
        }

        return list;
    }

    @Override
    public UserEntity userCreateDtoToUserEntity(UserCreateDTO user) {
        if ( user == null ) {
            return null;
        }

        UserEntity userEntity = new UserEntity();

        userEntity.setEmail( user.getEmail() );
        userEntity.setPhone( user.getPhone() );
        userEntity.setPassword( user.getPassword() );
        userEntity.setImage( user.getImage() );
        userEntity.setLastName( user.getLastName() );
        userEntity.setFirstName( user.getFirstName() );
        userEntity.setMiddleName( user.getMiddleName() );
        userEntity.setAddress( user.getAddress() );
        userEntity.setRole( user.getRole() );

        return userEntity;
    }

    protected UserItemDTO userEntityToUserItemDTO(UserEntity userEntity) {
        if ( userEntity == null ) {
            return null;
        }

        UserItemDTO userItemDTO = new UserItemDTO();

        userItemDTO.setEmail( userEntity.getEmail() );
        userItemDTO.setPhone( userEntity.getPhone() );
        userItemDTO.setPassword( userEntity.getPassword() );
        userItemDTO.setLastName( userEntity.getLastName() );
        userItemDTO.setFirstName( userEntity.getFirstName() );
        userItemDTO.setMiddleName( userEntity.getMiddleName() );
        userItemDTO.setAddress( userEntity.getAddress() );
        userItemDTO.setRole( userEntity.getRole() );
        userItemDTO.setImage( userEntity.getImage() );

        return userItemDTO;
    }
}
