package com.miaoyurun.hodgepodge.java.redis.service.impl;

import com.miaoyurun.hodgepodge.java.redis.model.UserBo;
import com.miaoyurun.hodgepodge.java.redis.service.UserService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Override
    @Cacheable(cacheNames = "user::get", sync = true)
    public UserBo get(Long id) {
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        return new UserBo(id, "user_" + id);
    }
}
