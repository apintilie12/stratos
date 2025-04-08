package com.sd.stratos.dto;

import com.sd.stratos.entity.Aircraft;
import com.sd.stratos.entity.MaintenanceStatus;
import com.sd.stratos.entity.MaintenanceType;
import com.sd.stratos.entity.User;
import jakarta.validation.constraints.NotNull;

import java.time.ZonedDateTime;

public record MaintenanceRecordCreateDTO(
   @NotNull
   String aircraft,

   @NotNull
   User engineer,

   @NotNull
   ZonedDateTime startDate,

   @NotNull
   ZonedDateTime endDate,

   @NotNull
   MaintenanceType type,

   @NotNull
   MaintenanceStatus status
) {}
