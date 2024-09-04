package com.miaoyurun.hodgepodge.java.async.service.impl;

import com.miaoyurun.hodgepodge.java.async.service.UserService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Override
    @Async
    public void doAsync() {
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        System.out.println("doAsync");
    }
}
