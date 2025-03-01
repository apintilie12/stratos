package com.sd.stratos.service;

import com.sd.stratos.entity.Flight;
import com.sd.stratos.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
}
