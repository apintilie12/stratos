package com.sd.stratos.dto;

import com.sd.stratos.entity.MaintenanceStatus;
import com.sd.stratos.entity.MaintenanceType;
import jakarta.validation.constraints.NotNull;

import java.time.ZonedDateTime;
import java.util.UUID;

public record MaintenanceRecordCreateDTO(
   @NotNull
   String aircraft,

   @NotNull
   UUID engineer,

   @NotNull
   ZonedDateTime startDate,

   @NotNull
   ZonedDateTime endDate,

   @NotNull
   MaintenanceType type,

   @NotNull
   MaintenanceStatus status
) {}
