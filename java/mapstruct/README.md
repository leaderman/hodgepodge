# 安装

[安装说明](https://mapstruct.org/documentation/installation/)

[Lombok 使用注意事项](https://mapstruct.org/documentation/stable/reference/html/#lombok)

# 使用自定义方法实现字段映射

自定义方法需要使用 @Named 注解声明方法名称，然后在使用 @Mapping 注解的 qualifiedByName 属性中指定方法名称。

- nameToFirstName
- nameToLastName

# source

@Mapping 注解的 source 属性定义从哪个对象（参数名）的哪个属性获取数据。

- combineName