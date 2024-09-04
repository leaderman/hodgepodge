package com.miaoyurun.hodgepodge.java.redis.service;

import com.miaoyurun.hodgepodge.java.redis.model.UserBo;

public interface UserService {
    UserBo get(Long id);
}
