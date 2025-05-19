package com.sd.stratos.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class AircraftTypeInfo {

    @Id
    @Enumerated(EnumType.STRING)
    private AircraftType aircraftType;

    @NotNull
    private int cruisingSpeedKnots;

    @NotNull
    private int cruisingDistanceMiles;
}
