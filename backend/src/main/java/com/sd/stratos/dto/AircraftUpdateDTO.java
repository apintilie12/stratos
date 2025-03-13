package com.sd.stratos.dto;

import com.sd.stratos.entity.AircraftStatus;
import com.sd.stratos.entity.AircraftType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.UUID;

public record AircraftUpdateDTO(
        @NotNull
        UUID id,

        @Pattern(regexp = "^[A-Z0-9]{1,2}-[A-Z]{3,4}$", message = "Invalid aircraft registration number format")
        String registrationNumber,

        @NotNull
        AircraftType type,

        @NotNull
        AircraftStatus status
){}
