# 分层领域模型

## Controller Layer（控制层）

- Request Object（RO）： 封装客户端请求的数据，用于接收和验证输入。
- View Object（VO）：封装服务端响应的数据，用于定制输出。

## Service Layer（服务层）

- Business Object（BO）：封装业务数据，用于业务操作。
- Command Object（CO）：封装业务命令，用于业务操作。

## DAO Layer（数据访问层）

- Persistent Object（PO）：封装数据表的行记录，用于数据操作。
- Command Object（CO）：封装数据命令，用于数据操作。

## 其他

- DTO（Data Transfer Object）：在不同层或对象之间中转数据。