package com.miaoyurun.hodgepodge.java.mybatis.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.miaoyurun.hodgepodge.java.mybatis.model.Gender;
import com.miaoyurun.hodgepodge.java.mybatis.model.User;
import com.miaoyurun.hodgepodge.java.mybatis.model.UserDetail;
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

    @Test
    public void testListByAge() {
        LambdaQueryWrapper<User> query = new LambdaQueryWrapper<>();
        query.ge(User::getAge, 20);

        List<User> users = userService.list(query);
        users.forEach(System.out::println);
    }

    @Test
    public void testSave() {
        User user = new User();

        user.setName("LiLei");
        user.setAge(36);
        user.setEmail("lilei@baomidou.com");
        user.setGender(Gender.MALE);
        user.setHobbies(new String[]{"reading", "coding"});
        user.setDetail(new UserDetail(180, 70, "Beijing"));

        boolean result = userService.save(user);
        assert result;

        System.out.println("User ID: " + user.getId());
    }
}
