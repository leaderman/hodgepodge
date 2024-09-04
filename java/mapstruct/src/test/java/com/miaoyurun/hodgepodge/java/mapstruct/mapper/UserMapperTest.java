package com.miaoyurun.hodgepodge.java.mapstruct.mapper;

import com.miaoyurun.hodgepodge.java.mapstruct.model.UserBo;
import com.miaoyurun.hodgepodge.java.mapstruct.model.UserPo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    public void testToUserPo() {
        UserBo userBo = new UserBo();
        userBo.setName("John Smith");
        userBo.setAge(18);

        UserPo userPo = userMapper.toUserPo(userBo);
        System.out.println(userPo);
    }

    @Test
    public void testToUserBo() {
        UserPo userPo = new UserPo();
        userPo.setFirstName("John");
        userPo.setLastName("Smith");
        userPo.setAge(18);

        UserBo userBo = userMapper.toUserBo(userPo);
        System.out.println(userBo);
    }
}
