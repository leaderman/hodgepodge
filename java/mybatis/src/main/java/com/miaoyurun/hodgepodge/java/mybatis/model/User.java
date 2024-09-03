package com.miaoyurun.hodgepodge.java.mybatis.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName(autoResultMap = true)
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private Integer age;
    private String email;
    private Gender gender;
    @TableField(typeHandler = JacksonTypeHandler.class)
    private String[] hobbies;
    @TableField(typeHandler = JacksonTypeHandler.class)
    private UserDetail detail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
