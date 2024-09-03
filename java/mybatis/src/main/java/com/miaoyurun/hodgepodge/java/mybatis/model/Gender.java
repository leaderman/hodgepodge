package com.miaoyurun.hodgepodge.java.mybatis.model;

import com.baomidou.mybatisplus.annotation.EnumValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Gender {
    MALE(1, "男"),
    FEMALE(2, "女");

    @EnumValue
    private final int value;
    private final String desc;
}
