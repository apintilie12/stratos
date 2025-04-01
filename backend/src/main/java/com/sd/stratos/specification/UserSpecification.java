package com.sd.stratos.specification;

import com.sd.stratos.entity.User;
import com.sd.stratos.entity.UserRole;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {

    public static Specification<User> hasUsername(String username) {
        return (root, query, criteriaBuilder) ->
                (username == null || username.isEmpty()) ? null :
                        criteriaBuilder.like(root.get("username"), "%" + username + "%");
    }

    public static Specification<User> hasRole(UserRole role) {
        return (root, query, criteriaBuilder) ->
                (role == null) ? null : criteriaBuilder.equal(root.get("role"), role);
    }
}
