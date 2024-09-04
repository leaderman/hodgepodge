package com.miaoyurun.hodgepodge.java.redis.service;

import com.miaoyurun.hodgepodge.java.redis.model.UserBo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UserServiceTest {
    @Autowired
    private UserService userService;

    @Test
    public void testGet() {
        UserBo user = userService.get(1L);
        System.out.println(user);
    }
}
