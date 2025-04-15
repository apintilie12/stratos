package com.sd.stratos.dto;

import com.sd.stratos.entity.User;
import com.sd.stratos.entity.UserRole;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ExistingUserDTO(@NotNull UUID id, @NotNull String username, @NotNull UserRole role) {

    public static ExistingUserDTO from(User user) {
        return new ExistingUserDTO(user.getId(), user.getUsername(), user.getRole());
    }
}
