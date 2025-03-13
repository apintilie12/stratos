package com.sd.stratos.dto;

import com.sd.stratos.entity.Aircraft;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.ZonedDateTime;

public record FlightCreateDTO(
        @Pattern(regexp = "^[A-Z]{2}[1-9][0-9]{0,3}$", message = "Invalid flight number format")
        String flightNumber,

        @Pattern(regexp = "^[A-Z]{3}$", message = "Departure airport code not in IATA format")
        String departureAirport,

        @Pattern(regexp="^[A-Z]{3}$", message ="Arrival airport code not in IATA format")
        String arrivalAirport,

        @NotNull
        ZonedDateTime departureTime,

        @NotNull
        ZonedDateTime arrivalTime,

        @NotNull
        Aircraft aircraft
){}