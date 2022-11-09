package org.example.services;

import org.example.entity.UserEntity;
import org.example.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collection;

@Service
@Transactional
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        UserEntity user = userRepository.findByEmail(username);
        if(user==null)
            throw new UsernameNotFoundException("Email "+ username +" not found");
        return new org.springframework
                .security.core.userdetails.User(user.getEmail(),
                user.getPassword(), getAuthorities(user));
    }

    private static Collection<? extends GrantedAuthority> getAuthorities(UserEntity user) {
        String userRoles = user.getRole().getName();
        Collection<GrantedAuthority> authorityCollections =
                AuthorityUtils.createAuthorityList(userRoles);
        return authorityCollections;
    }
}
