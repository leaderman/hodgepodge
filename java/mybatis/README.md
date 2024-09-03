# MySQL

创建表语句

```mysql
DROP TABLE IF EXISTS `user`;

CREATE TABLE `user`
(
    `id`    BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `name`  VARCHAR(30) DEFAULT NULL COMMENT '姓名',
    `age`   INT         DEFAULT NULL COMMENT '年龄',
    `email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='用户信息表';
```

初始化数据语句

```mysql
DELETE
FROM `user`;

INSERT INTO `user` (`id`, `name`, `age`, `email`)
VALUES (1, 'Jone', 18, 'test1@baomidou.com'),
       (2, 'Jack', 20, 'test2@baomidou.com'),
       (3, 'Tom', 28, 'test3@baomidou.com'),
       (4, 'Sandy', 21, 'test4@baomidou.com'),
       (5, 'Billie', 24, 'test5@baomidou.com');
```

增加列 gender

```mysql
ALTER TABLE user
    ADD COLUMN gender INT DEFAULT 0;
```

初始化列 gender 数据

```mysql
UPDATE user
SET gender = IF(MOD(id, 2) = 0, 2, 1);
```

增加列 hobbies

```mysql
ALTER TABLE user
    ADD COLUMN hobbies varchar(128) DEFAULT '[]';
```

初始化列 hobbies

```mysql
UPDATE user
SET hobbies = CASE
                  WHEN id = 1 THEN '["Reading", "Swimming"]'
                  WHEN id = 2 THEN '["Cycling", "Hiking"]'
                  WHEN id = 3 THEN '["Gaming", "Drawing"]'
                  WHEN id = 4 THEN '["Cooking", "Traveling"]'
                  WHEN id = 5 THEN '["Photography", "Dancing"]'
    END
WHERE id BETWEEN 1 AND 5;
```

增加列 detail

```mysql
ALTER TABLE user
    ADD COLUMN detail varchar(128) DEFAULT '{}';
```

增加列 created_at 和 updated_at

```mysql
ALTER TABLE user
    ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

# Service/Dao

- Service 接口需要继承 IService；
- Service 实现类需要继承 ServiceImpl；
- Dao 接口需要继承 BaseMapper。

# 使用 Lambda 表达式构建条件

可以通过 lambda 版本的 QueryWrapper，即 LambdaQueryWrapper 来构建条件，这样可以使用 Java 属性而不是数据库列名来指定字段。

# 枚举类型

枚举属性使用 @EnumValue 注解，指定枚举值在数据库中存储的实际值。

# JSON 类型

JSON 类型（数组或对象）属性使用 @TableField(typeHandler = JacksonTypeHandler.class) 注解，指定 JSON 类型处理器。

注意：必须开启映射注解 @TableName(autoResultMap = true)。

# 主键 ID 自增一

需要在实体类的主键属性上添加 @TableId(type = IdType.AUTO) 注解。

# 查看 SQL

将 dao 包的日志级别调整为 debug，可以查看执行的 SQL 语句。