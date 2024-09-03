package com.miaoyurun.hodgepodge.java.mybatis.dao;

import com.miaoyurun.hodgepodge.java.mybatis.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class UserDaoTest {
    @Autowired
    private UserDao userDao;

    @Test
    public void testSelectList() {
        List<User> users = userDao.selectList(null);
        users.forEach(System.out::println);
    }
}
