package com.miaoyurun.hodgepodge.java.mapstruct.mapper;


import com.miaoyurun.hodgepodge.java.mapstruct.model.UserBo;
import com.miaoyurun.hodgepodge.java.mapstruct.model.UserPo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(source = "name", target = "firstName", qualifiedByName = "nameToFirstName")
    @Mapping(source = "name", target = "lastName", qualifiedByName = "nameToLastName")
    UserPo toUserPo(UserBo userBO);

    @Named("nameToFirstName")
    default String nameToFirstName(String name) {
        return name.split(" ")[0];
    }

    @Named("nameToLastName")
    default String nameToLastName(String name) {
        return name.split(" ")[1];
    }

    @Mapping(source = "userPo", target = "name", qualifiedByName = "combineName")
    UserBo toUserBo(UserPo userPo);

    @Named("combineName")
    default String combineName(UserPo userPo) {
        return userPo.getFirstName() + " " + userPo.getLastName();
    }
}
