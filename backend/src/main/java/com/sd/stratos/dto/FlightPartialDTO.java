package com.sd.stratos.dto;

import com.sd.stratos.entity.Aircraft;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.ZonedDateTime;
import java.util.UUID;

public record FlightPartialDTO(

        @Pattern(regexp = "^[A-Z]{3}$", message = "Departure airport code not in IATA format")
        String departureAirport,

        @Pattern(regexp="^[A-Z]{3}$", message ="Arrival airport code not in IATA format")
        String arrivalAirport,

        @NotNull
        ZonedDateTime departureTime,

        @NotNull
        String aircraft
) {
}
