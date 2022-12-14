package org.example.web;

import io.swagger.annotations.Api;
import lombok.RequiredArgsConstructor;
import org.example.configuration.captcha.CaptchaSettings;
import org.example.configuration.captcha.GoogleResponse;
import org.example.dto.OrderDto.*;
import org.example.entity.OrderEntity;
import org.example.entity.UserEntity;
import org.example.mapper.ApplicationMapper;
import org.example.repositories.OrderRepository;
import org.example.repositories.UserRepository;
import org.example.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestOperations;

import java.util.ArrayList;
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
            UserEntity user = new UserEntity();
            List<UserEntity> list = userRepository.findAll();
            for(UserEntity item: list)
            {
                if(item.getEmail().equals(order.getEmailCustomer()))
                    user = item;
            }
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
            UserEntity user = new UserEntity();
            List<UserEntity> list = userRepository.findAll();
            for(UserEntity item: list)
            {
                if(item.getEmail().equals(order.getEmailDriver()))
                    user = item;
            }
            List<OrderEntity> orders = user.getOrdersDrivers();
            if(orders.size()>0)
            {
                boolean ch = false;
                for(OrderEntity item: orders)
                {
                    if(item.getDriverMark() == 0 && item.getCustomerMark() == 0)
                    {
                        ch = true;
                    }
                }
                if (ch)
                    return "no";
                else
                    return "ok";
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
            UserEntity driver = new UserEntity();
            List<UserEntity> list = userRepository.findAll();
            for(UserEntity item: list)
            {
                if(item.getEmail().equals(order.getEmail()))
                    driver = item;
            }
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
    @PostMapping("/successDriver")
    public String SetOrderSuccessDriver(@RequestBody OrderSuccessDriverDTO order)
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
            UserEntity driver = new UserEntity();
            List<UserEntity> list = userRepository.findAll();
            for(UserEntity item: list)
            {
                if(item.getEmail().equals(order.getEmail()))
                    driver = item;
            }
            OrderEntity orderEntity = orderRepository.findById(order.getId());
            ArrayList<Integer> rait = driver.getRaiting();
            rait.add(order.getMark());
            driver.setRaiting(rait);
            userRepository.save(driver);
            orderEntity.setDriverMark(order.getMark());
            if(orderEntity.getCustomerMark() == 0)
            {
                orderRepository.save(orderEntity);
            }
            else
            {
                orderRepository.delete(orderEntity);
            }
            return "ok";
        }catch(BadCredentialsException ex) {
            return "404";
        }
    }
    @PostMapping("/getOrderDriver")
    public List<DriverGetOrderDTO> GetOrderForDriver(@RequestBody OrderGetUserDTO driver)
    {

        try{
            UserEntity driverEntity = userRepository.findByEmail(driver.getEmail());

            OrderEntity orderEntity = new OrderEntity();
            List<DriverGetOrderDTO> orders = new ArrayList<DriverGetOrderDTO>();
            List<OrderEntity> ordersEntity = driverEntity.getOrdersDrivers();
            for(OrderEntity item: ordersEntity)
            {
                if(item.getDriverMark() == 0)
                {
                    orderEntity = item;
                    UserEntity customer = userRepository.findByEmail(item.getCustomer().getEmail());
                    DriverGetOrderDTO orderDTO = new DriverGetOrderDTO(item.getId(), item.getName(),
                            item.getFromRegion(),item.getFromCity(),item.getFromAddress(),
                            item.getToRegion(),item.getToCity(),item.getToAddress(),item.getWeight(),
                            item.getImage(), item.getPrice(), item.getDownloadDate(), item.getDriverMark(),
                            item.getCustomerMark(),customer.getImage(),customer.getLastName(),customer.getFirstName(),
                            customer.getMiddleName(),customer.getEmail(),customer.getPhone(),customer.getAddress(),
                            customer.getRole().toString());
                    orders.add(orderDTO);
                }
            }
            return orders;

        }catch(BadCredentialsException ex) {

            return null;
        }
    }
    @PostMapping("/getOrdersForDrivers")
    public List<DriverGetOrderDTO> GetOrdersForDriver(@RequestBody OrderGetUserDTO driver)
    {
        try {
            UserEntity driverEntity = userRepository.findByEmail(driver.getEmail());
            OrderEntity orderEntity = new OrderEntity();

            List<DriverGetOrderDTO> orders = new ArrayList<DriverGetOrderDTO>();
            for(OrderEntity item: driverEntity.getOrdersDrivers())
            {

                orderEntity = item;
                DriverGetOrderDTO driverGetOrderDTO = new DriverGetOrderDTO(orderEntity.getId(), orderEntity.getName(),
                        orderEntity.getFromRegion(),orderEntity.getFromCity(),orderEntity.getFromAddress(),
                        orderEntity.getToRegion(),orderEntity.getToCity(),orderEntity.getToAddress(),
                        orderEntity.getWeight(), orderEntity.getImage(), orderEntity.getPrice(),orderEntity.getDownloadDate(),
                        orderEntity.getCustomerMark(),orderEntity.getDriverMark(),driverEntity.getImage(),
                        driverEntity.getLastName(),driverEntity.getFirstName(), driverEntity.getMiddleName(),
                        driverEntity.getEmail(), driverEntity.getPhone(),driverEntity.getAddress(),
                        driverEntity.getRole().toString());
                orders.add(driverGetOrderDTO);

            }
            return  orders;

        }catch(BadCredentialsException ex) {

            return null;
        }
    }
    @PostMapping("/getCustomer")
    public GetCustomerDTO GetCustomer (@RequestBody int id)
    {
        try{
            OrderEntity order = orderRepository.findById(id);
            UserEntity customerEntity = order.getCustomer();
            GetCustomerDTO customer = new GetCustomerDTO(customerEntity.getImage(),customerEntity.getLastName(),
                    customerEntity.getFirstName(),customerEntity.getMiddleName(),customerEntity.getEmail(),
                    customerEntity.getPhone());
            return  customer;
        }
        catch(Exception ex)
        {
            return null;
        }
    }
    @PostMapping("/getOrderCustomer")
    public List<CustomerGetOrderDTO> GetOrderForCustomer(@RequestBody OrderGetUserDTO customer)
    {
        try {
            UserEntity customerEntity = userRepository.findByEmail(customer.getEmail());

            OrderEntity orderEntity = new OrderEntity();
            List<CustomerGetOrderDTO> orders = new ArrayList<CustomerGetOrderDTO>();
            List<OrderEntity> ordersEntity = customerEntity.getOrdersCustomers();
            for(OrderEntity item: ordersEntity)
            {
                if(item.getCustomerMark() == 0)
                {
                    orderEntity = item;
                    if(orderEntity.getDriver() != null)
                    {
                        UserEntity driver = userRepository.findByEmail(orderEntity.getDriver().getEmail());
                        CustomerGetOrderDTO orderDTO = new CustomerGetOrderDTO(
                                orderEntity.getId(),orderEntity.getName(),orderEntity.getFromRegion(),
                                orderEntity.getFromCity(),orderEntity.getFromAddress(),
                                orderEntity.getToRegion(),orderEntity.getToCity(),orderEntity.getToAddress(),
                                orderEntity.getWeight(),orderEntity.getImage(),orderEntity.getPrice(),
                                orderEntity.getDownloadDate(),orderEntity.getCustomerMark(),orderEntity.getDriverMark(),
                                driver.getImage(), driver.getLastName(), driver.getFirstName(), driver.getMiddleName(),
                                driver.getEmail(), driver.getPhone(),driver.getAddress(),driver.getRole().toString());
                        orders.add(orderDTO);
                    }
                    else
                    {
                        CustomerGetOrderDTO orderDTO = new CustomerGetOrderDTO(
                                orderEntity.getId(),orderEntity.getName(),orderEntity.getFromRegion(),
                                orderEntity.getFromCity(),orderEntity.getFromAddress(),
                                orderEntity.getToRegion(),orderEntity.getToCity(),orderEntity.getToAddress(),
                                orderEntity.getWeight(),orderEntity.getImage(),orderEntity.getPrice(),
                                orderEntity.getDownloadDate(),orderEntity.getCustomerMark(),orderEntity.getDriverMark(),
                                "", "", "", "",
                                "", "","","");
                        orders.add(orderDTO);
                    }
                }
            }
            return orders;


        }catch(BadCredentialsException ex) {

            return null;
        }
    }

    @PostMapping("/getOrdersForCustomers")
    public List<DriverGetOrderDTO> GetOrdersFoCustomer(@RequestBody OrderGetUserDTO customer)
    {
        try {
            UserEntity customerEntity = userRepository.findByEmail(customer.getEmail());
            OrderEntity orderEntity = new OrderEntity();

            List<DriverGetOrderDTO> orders = new ArrayList<DriverGetOrderDTO>();
            for(OrderEntity item: customerEntity.getOrdersCustomers())
            {

                    orderEntity = item;
                    DriverGetOrderDTO driverGetOrderDTO = new DriverGetOrderDTO(orderEntity.getId(), orderEntity.getName(),
                            orderEntity.getFromRegion(),orderEntity.getFromCity(),orderEntity.getFromAddress(),
                            orderEntity.getToRegion(),orderEntity.getToCity(),orderEntity.getToAddress(),
                            orderEntity.getWeight(), orderEntity.getImage(), orderEntity.getPrice(),orderEntity.getDownloadDate(),
                            orderEntity.getCustomerMark(),orderEntity.getDriverMark(),customerEntity.getImage(),
                            customerEntity.getLastName(),customerEntity.getFirstName(), customerEntity.getMiddleName(),
                            customerEntity.getEmail(), customerEntity.getPhone(),customerEntity.getAddress(),
                            customerEntity.getRole().toString());
                    orders.add(driverGetOrderDTO);

            }
            return  orders;

        }catch(BadCredentialsException ex) {

            return null;
        }
    }
    @PostMapping("/deleteOrder")
    public String deleteOrder(@RequestBody OrderDeleteDTO order)
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
            OrderEntity orderEntity = orderRepository.findById(order.getId());
            storageService.removeFile(orderEntity.getImage());
            UserEntity user = userRepository.findByEmail(orderEntity.getCustomer().getEmail());
            user.getOrdersCustomers().remove(orderEntity);
            userRepository.save(user);
            orderRepository.delete(orderEntity);
            return "ok";

        }catch(BadCredentialsException ex) {

            return "no";
        }
    }
    @PostMapping("/setMarkDriver")
    public String setMarkDriver(@RequestBody DriverSetMarkDTO driverMark)
    {
        try {
            String url = String.format(RECAPTCHA_URL_TEMPLATE, captchaSettings.getSecretkey(), driverMark.getRecaptchaToken());
            try {
                final GoogleResponse googleResponse = restTemplate.getForObject(url, GoogleResponse.class);
                if (!googleResponse.isSuccess()) {
                    throw new Exception("reCaptcha was not successfully validated");
                }
            }
            catch (Exception rce) {
                String str = rce.getMessage();
            }
            UserEntity driver = userRepository.findByEmail(driverMark.getEmail());
            OrderEntity order = orderRepository.findById(driverMark.getId());
            UserEntity customer = userRepository.findByEmail(order.getCustomer().getEmail());
            ArrayList<Integer> marks = customer.getRaiting();
            if(marks == null)
                marks = new ArrayList<Integer>();
            marks.add(driverMark.getMark());
            customer.setRaiting(marks);
            userRepository.save(customer);
            order.setDriverMark(driverMark.getMark());
            if(order.getCustomerMark() == 0)
                orderRepository.save(order);
            if(order.getCustomerMark() != 0)
            {
                storageService.removeFile(order.getImage());
                orderRepository.delete(order);
            }


            return "ok";
        }catch(BadCredentialsException ex) {
            return "404";
        }
    }
    @PostMapping("/setMarkCustomer")
    public String setMarkCustomer(@RequestBody CustomerSetMarkDTO customerMark)
    {
        try {
            String url = String.format(RECAPTCHA_URL_TEMPLATE, captchaSettings.getSecretkey(), customerMark.getRecaptchaToken());
            try {
                final GoogleResponse googleResponse = restTemplate.getForObject(url, GoogleResponse.class);
                if (!googleResponse.isSuccess()) {
                    throw new Exception("reCaptcha was not successfully validated");
                }
            }
            catch (Exception rce) {
                String str = rce.getMessage();
            }
            UserEntity customer = userRepository.findByEmail(customerMark.getEmail());
            OrderEntity order = orderRepository.findById(customerMark.getId());
            UserEntity driver = userRepository.findByEmail(order.getDriver().getEmail());
            ArrayList<Integer> marks = driver.getRaiting();
            if(marks == null)
                marks = new ArrayList<Integer>();
            marks.add(customerMark.getMark());
            driver.setRaiting(marks);
            userRepository.save(driver);
            order.setCustomerMark(customerMark.getMark());
            if(order.getDriverMark() == 0)
                orderRepository.save(order);
            if(order.getDriverMark() != 0)
            {
                storageService.removeFile(order.getImage());
                orderRepository.delete(order);
            }


            return "ok";
        }catch(BadCredentialsException ex) {
            return "404";
        }
    }
}
