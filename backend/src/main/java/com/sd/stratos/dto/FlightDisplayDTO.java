package com.sd.stratos.dto;

import com.sd.stratos.entity.Flight;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.ZonedDateTime;
import java.util.UUID;

public record FlightDisplayDTO(
        @NotNull
        UUID id,

        @Pattern(regexp = "^[A-Z]{2}[1-9][0-9]{0,3}$", message = "Invalid flight number format")
        String flightNumber,

        @Pattern(regexp = "^[A-Z]{3}$", message = "Departure airport code not in IATA format")
        String departureAirport,

        @Pattern(regexp = "^[A-Z]{3}$", message = "Arrival airport code not in IATA format")
        String arrivalAirport,

        @NotNull
        ZonedDateTime departureTime,

        @NotNull
        ZonedDateTime arrivalTime,

        @NotNull
        String aircraft
) {
    public static FlightDisplayDTO fromFlight(Flight flight) {
        return new FlightDisplayDTO(flight.getId(), flight.getFlightNumber(), flight.getDepartureAirport(), flight.getArrivalAirport(), flight.getDepartureTime(), flight.getArrivalTime(), flight.getAircraft().getRegistrationNumber());
    }
}
