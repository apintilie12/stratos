package com.sd.stratos.service;

import com.sd.stratos.entity.Flight;
import com.sd.stratos.exception.FlightNumberAlreadyExistsException;
import com.sd.stratos.exception.InvalidFlightEndpointsException;
import com.sd.stratos.exception.InvalidFlightTimesException;
import com.sd.stratos.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FlightService {
    private final FlightRepository flightRepository;

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    public Flight getFlightById(UUID id) {
        return flightRepository.findById(id).orElse(null);
    }

    public Flight addFlight(Flight flight) {
        if(flightRepository.findByFlightNumber(flight.getFlightNumber()) != null) {
            throw new FlightNumberAlreadyExistsException("Flight number already exists");
        }
        validateFlight(flight);
        return flightRepository.save(flight);
    }

    public Flight updateFlight(UUID id, Flight flight) {
        Optional<Flight> existingFlight = flightRepository.findById(id);
        if (existingFlight.isPresent()) {
            Flight updatedFlight = existingFlight.get();
            updatedFlight.setFlightNumber(flight.getFlightNumber());
            updatedFlight.setDepartureTime(flight.getDepartureTime());
            updatedFlight.setArrivalTime(flight.getArrivalTime());
            updatedFlight.setDepartureAirport(flight.getDepartureAirport());
            updatedFlight.setArrivalAirport(flight.getArrivalAirport());
            updatedFlight.setAircraft(flight.getAircraft());
            return flightRepository.save(updatedFlight);
        }
        throw new IllegalArgumentException("Flight not found");
    }

    public void deleteFlight(UUID id) {
        flightRepository.deleteById(id);
    }

    private void validateTimes(ZonedDateTime departureTime, ZonedDateTime arrivalTime) {
        if(departureTime.isAfter(arrivalTime)){
            throw new InvalidFlightTimesException("Departure time is after arrival time");
        }
        if(departureTime.isBefore(ZonedDateTime.now()) || arrivalTime.isBefore(ZonedDateTime.now())){
            throw new InvalidFlightTimesException("Departure time is before current time");
        }
    }

    private void validateFlight(Flight flight) {
        validateTimes(flight.getDepartureTime(), flight.getArrivalTime());
        if(flight.getDepartureAirport().equals(flight.getArrivalAirport())) {
            throw new InvalidFlightEndpointsException("Arrival and departure airports must be different");
        }
    }
}
