package com.sd.stratos.dto;

import com.sd.stratos.entity.Aircraft;
import com.sd.stratos.entity.MaintenanceStatus;
import com.sd.stratos.entity.MaintenanceType;
import com.sd.stratos.entity.User;
import jakarta.validation.constraints.NotNull;

import java.time.ZonedDateTime;
import java.util.UUID;

public record MaintenanceRecordUpdateDTO(
        @NotNull
        UUID id,

        @NotNull
        String aircraft,

        @NotNull
        String engineer,

        @NotNull
        ZonedDateTime startDate,

        @NotNull
        ZonedDateTime endDate,

        @NotNull
        MaintenanceType type,

        @NotNull
        MaintenanceStatus status
) {}
