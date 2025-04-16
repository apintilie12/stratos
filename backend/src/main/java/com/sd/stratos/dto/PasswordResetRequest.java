package com.sd.stratos.dto;

import jakarta.validation.constraints.NotNull;

public record PasswordResetRequest(@NotNull String username, @NotNull String password) {}
