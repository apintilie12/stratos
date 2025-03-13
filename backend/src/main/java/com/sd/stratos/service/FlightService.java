package com.sd.stratos.service;

import com.sd.stratos.dto.FlightCreateDTO;
import com.sd.stratos.dto.FlightUpdateDTO;
import com.sd.stratos.entity.Flight;
import com.sd.stratos.exception.FlightNumberAlreadyExistsException;
import com.sd.stratos.exception.InvalidFlightEndpointsException;
import com.sd.stratos.exception.InvalidFlightTimesException;
import com.sd.stratos.repository.AircraftRepository;
import com.sd.stratos.repository.FlightRepository;
import jakarta.validation.Valid;
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
    private final AircraftRepository aircraftRepository;

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    public Flight getFlightById(UUID id) {
        return flightRepository.findById(id).orElse(null);
    }

    public Flight addFlight(@Valid FlightCreateDTO flightCreateDTO) {
        if(flightRepository.findByFlightNumber(flightCreateDTO.flightNumber()) != null) {
            throw new FlightNumberAlreadyExistsException("Flight number already exists");
        }
        Flight flightToAdd = new Flight();
        flightToAdd.setFlightNumber(flightCreateDTO.flightNumber());
        flightToAdd.setArrivalTime(flightCreateDTO.arrivalTime());
        flightToAdd.setDepartureTime(flightCreateDTO.departureTime());
        flightToAdd.setDepartureAirport(flightCreateDTO.departureAirport());
        flightToAdd.setArrivalAirport(flightCreateDTO.arrivalAirport());
        flightToAdd.setAircraft(flightCreateDTO.aircraft());
        validateFlight(flightToAdd);
        return flightRepository.save(flightToAdd);
    }

    public Flight updateFlight(UUID id, FlightUpdateDTO flight) {
        Optional<Flight> existingFlight = flightRepository.findById(id);
        if (existingFlight.isPresent()) {
            Flight updatedFlight = existingFlight.get();
            updatedFlight.setFlightNumber(flight.flightNumber());
            updatedFlight.setDepartureTime(flight.departureTime());
            updatedFlight.setArrivalTime(flight.arrivalTime());
            updatedFlight.setDepartureAirport(flight.departureAirport());
            updatedFlight.setArrivalAirport(flight.arrivalAirport());
            updatedFlight.setAircraft(flight.aircraft());
            validateFlight(updatedFlight);
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
        if(aircraftRepository.findById(flight.getAircraft().getId()).isEmpty()) {
            throw new IllegalStateException("Aircraft not in database");
        }
    }
}
