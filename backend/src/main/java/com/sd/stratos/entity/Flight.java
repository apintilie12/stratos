package com.sd.stratos.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Pattern(regexp = "^[A-Z]{2}[1-9][0-9]{0,3}$", message = "Invalid flight number format")
    @Column(nullable = false, unique = true)
    private String flightNumber;

    @Pattern(regexp = "^[A-Z]{3}$", message = "Departure airport code not in IATA format")
    @Column(nullable = false)
    private String departureAirport;

    @Pattern(regexp = "^[A-Z]{3}$", message = "Arrival airport code not in IATA format")
    @Column(nullable = false)
    private String arrivalAirport;

    @Column(nullable = false)
    private ZonedDateTime departureTime;

    @Column(nullable = false)
    private ZonedDateTime arrivalTime;

    @ManyToOne(optional = false)
    private Aircraft aircraft;

}
