package com.miaoyurun.hodgepodge.java.mybatis.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetail {
    private Integer height;
    private Integer weight;
    private String address;
}
