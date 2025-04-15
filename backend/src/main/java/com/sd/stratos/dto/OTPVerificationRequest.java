package com.sd.stratos.dto;

import jakarta.validation.constraints.NotNull;

public record OTPVerificationRequest(@NotNull String username, @NotNull String code) {}
