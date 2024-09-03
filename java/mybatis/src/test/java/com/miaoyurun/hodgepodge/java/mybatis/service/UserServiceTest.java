package com.miaoyurun.hodgepodge.java.mybatis.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.miaoyurun.hodgepodge.java.mybatis.model.Gender;
import com.miaoyurun.hodgepodge.java.mybatis.model.User;
import com.miaoyurun.hodgepodge.java.mybatis.model.UserDetail;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
    public void testListByCreatedAt() {
        LambdaQueryWrapper<User> query = new LambdaQueryWrapper<>();
//        query.ge(User::getCreatedAt, "2024-01-01 00:00:00");
//        query.ge(User::getCreatedAt, LocalDateTime.parse("2024-01-01T00:00:00", DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        query.ge(User::getCreatedAt, LocalDateTime.parse("2024-01-01 00:00:00", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        List<User> users = userService.list(query);
        users.forEach(System.out::println);
    }

    @Test
    public void testPage() {
        LambdaQueryWrapper<User> query = new LambdaQueryWrapper<>();
        query.orderByDesc(User::getAge);

        Page<User> page = userService.page(new Page<>(2, 3), query);

        List<User> users = page.getRecords();
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

    @Test
    public void testUpdate() {
        User user = userService.getById(1L);
        user.setAge(37);

        boolean result = userService.updateById(user);
        assert result;
    }
}
