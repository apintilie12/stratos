package com.sd.stratos.dto;

import com.sd.stratos.entity.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record UserUpdateDTO(
   @NotBlank(message = "ID is required")
   UUID id,

   @NotBlank(message = "Username is required")
   String username,

   @NotBlank(message = "Password is required")
   String password,

   @NotNull(message = "Role is required")
   UserRole role
) {}
