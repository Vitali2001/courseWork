package org.example.configuration.security;

import org.example.constants.Roles;
import org.example.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.Filter;
import javax.servlet.http.HttpServletResponse;

@Configuration
@EnableGlobalMethodSecurity(
        securedEnabled = true,
        jsr250Enabled = true,
        prePostEnabled = true
)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserService userService;
    private final JwtTokenFilter jwtTokenFilter;

    public SecurityConfig(JwtTokenFilter jwtTokenFilter) {
        super();
        this.jwtTokenFilter = jwtTokenFilter;
        // Inherit security context in async function calls
        SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_INHERITABLETHREADLOCAL);
    }

    @Value("${springdoc.api-docs.path}")
    private String restApiDocPath;
    @Value("${springdoc.swagger-ui.path}")
    private String swaggerPath;

    @Autowired
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
        auth
                .userDetailsService(userService) //Як перевіряється користувач, який авторизовано
                .passwordEncoder(encoder); //Еncoder, який шифрує пароль
    }
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // Enable CORS and disable CSRF
        http = http.cors().and().csrf().disable();

        // Set session management to stateless
        http = http
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and();

        // Set unauthorized requests exception handler
        http = http
                .exceptionHandling()
                .authenticationEntryPoint(
                        (request, response, ex) -> {
                            //logger.error("Unauthorized request - {}", ex.getMessage());
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, ex.getMessage());
                        }
                )
                .and();

        // Set permissions on endpoints
        http.authorizeRequests()
                // Swagger endpoints must be publicly accessible
                //account
                .antMatchers("/").permitAll()
                .antMatchers("/api/account/login").permitAll()
                .antMatchers("/api/account/register").permitAll()
                .antMatchers("/files/**").permitAll()
                .antMatchers("/api/account/update").permitAll()
                .antMatchers("/api/account/changePassword").permitAll()
                //users
                .antMatchers("/api/users/drivers").permitAll()
                .antMatchers("/api/users/customers").permitAll()
                .antMatchers("/api/users/addUser").hasAuthority(Roles.Admin)
                .antMatchers("/api/users/updateUser").hasAuthority(Roles.Admin)
                .antMatchers("/api/users/deleteUser").hasAuthority(Roles.Admin)
                //orders
                .antMatchers("/api/orders/NotAcceptedOrders").permitAll()
                .antMatchers("/api/orders/addOrder").hasAuthority(Roles.Customer)
                .antMatchers("/api/orders/verifyDriver").hasAuthority(Roles.Driver)
                .antMatchers("/api/orders/setDriverOrder").hasAuthority(Roles.Driver)
                .antMatchers("/api/orders/successDriver").hasAuthority(Roles.Driver)
                .antMatchers("/api/orders/getOrderDriver").hasAuthority(Roles.Driver)
                .antMatchers("/api/orders/getCustomer").hasAuthority(Roles.Driver)

                .antMatchers("/files/**").permitAll()
                .antMatchers("/static/**").permitAll() //.hasAuthority(Roles.Admin)
                .antMatchers("/api/account/**").permitAll()
                .antMatchers("/swagger-resources/**").permitAll()
                .antMatchers("/swagger-ui.html").permitAll()
                .antMatchers("/v2/api-docs").permitAll()

                .antMatchers("/webjars/**").permitAll()
                .antMatchers(String.format("%s/**", restApiDocPath)).permitAll()
                .antMatchers(String.format("%s/**", swaggerPath)).permitAll()
                .antMatchers(String.format("%s/**", "/swagger-ui")).permitAll()
                .anyRequest().authenticated();
        // Add JWT token filter


        http.addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);
    }
    // Expose authentication manager bean
    @Override @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}