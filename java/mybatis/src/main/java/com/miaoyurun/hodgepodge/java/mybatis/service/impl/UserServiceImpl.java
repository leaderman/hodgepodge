package com.miaoyurun.hodgepodge.java.mybatis.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.miaoyurun.hodgepodge.java.mybatis.dao.UserDao;
import com.miaoyurun.hodgepodge.java.mybatis.model.User;
import com.miaoyurun.hodgepodge.java.mybatis.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserDao, User> implements UserService {
}
