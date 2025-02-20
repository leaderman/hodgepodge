package com.miaoyurun.hodgepodge.java.redis.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserBo implements Serializable {
    private Long id;
    private String name;
}
