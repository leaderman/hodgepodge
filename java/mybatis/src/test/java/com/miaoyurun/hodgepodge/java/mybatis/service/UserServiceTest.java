package com.miaoyurun.hodgepodge.java.mybatis.service;

import com.miaoyurun.hodgepodge.java.mybatis.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class UserServiceTest {
    @Autowired
    private UserService userService;

    @Test
    public void testList() {
        List<User> users = userService.list();
        users.forEach(System.out::println);
    }
}
