package com.sd.stratos.service;

import com.sd.stratos.dto.FlightCreateDTO;
import com.sd.stratos.dto.FlightPartialDTO;
import com.sd.stratos.dto.FlightUpdateDTO;
import com.sd.stratos.entity.Aircraft;
import com.sd.stratos.entity.AircraftStatus;
import com.sd.stratos.entity.AircraftTypeInfo;
import com.sd.stratos.entity.Flight;
import com.sd.stratos.exception.FlightNumberAlreadyExistsException;
import com.sd.stratos.exception.InvalidFlightEndpointsException;
import com.sd.stratos.exception.InvalidTimeIntervalException;
import com.sd.stratos.repository.AircraftRepository;
import com.sd.stratos.repository.FlightRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FlightService {
    private final FlightRepository flightRepository;
    private final AircraftRepository aircraftRepository;
    private final AirportService airportService;

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    public Flight getFlightById(UUID id) {
        return flightRepository.findById(id).orElse(null);
    }

    public Flight addFlight(FlightCreateDTO flightCreateDTO) {
        if (flightRepository.findByFlightNumber(flightCreateDTO.flightNumber()).isPresent()) {
            throw new FlightNumberAlreadyExistsException("Flight number already exists");
        }
        Flight flightToAdd = new Flight();
        flightToAdd.setFlightNumber(flightCreateDTO.flightNumber());
        flightToAdd.setArrivalTime(flightCreateDTO.arrivalTime());
        flightToAdd.setDepartureTime(flightCreateDTO.departureTime());
        flightToAdd.setDepartureAirport(flightCreateDTO.departureAirport());
        flightToAdd.setArrivalAirport(flightCreateDTO.arrivalAirport());
        Optional<Aircraft> maybeAircraft = aircraftRepository.findAircraftByRegistrationNumber(flightCreateDTO.aircraft());
        if (maybeAircraft.isEmpty()) {
            throw new IllegalArgumentException("Aircraft not found");
        }
        flightToAdd.setAircraft(maybeAircraft.get());
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
            updatedFlight.setAircraft(aircraftRepository.findAircraftByRegistrationNumber(flight.aircraft()).orElse(null));
            validateFlight(updatedFlight);
            return flightRepository.save(updatedFlight);
        }
        throw new IllegalArgumentException("Flight not found");
    }

    public void deleteFlight(UUID id) {
        flightRepository.deleteById(id);
    }

    private void validateTimes(ZonedDateTime departureTime, ZonedDateTime arrivalTime) {
        if (departureTime.isAfter(arrivalTime)) {
            throw new InvalidTimeIntervalException("Departure time is after arrival time");
        }
        if (departureTime.isBefore(ZonedDateTime.now()) || arrivalTime.isBefore(ZonedDateTime.now())) {
            throw new InvalidTimeIntervalException("Departure time is before current time");
        }
    }

    private void validateFlight(Flight flight) {
        validateTimes(flight.getDepartureTime(), flight.getArrivalTime());
        validateAssignedAircraft(flight);
        if (flight.getDepartureAirport().equals(flight.getArrivalAirport())) {
            throw new InvalidFlightEndpointsException("Arrival and departure airports must be different");
        }
        if (aircraftRepository.findById(flight.getAircraft().getId()).isEmpty()) {
            throw new IllegalStateException("Aircraft not in database");
        }
    }

    private void validateAssignedAircraft(Flight flight) {
        if(flight.getAircraft() == null) {
            throw new IllegalStateException("Aircraft not found");
        }
        Optional<Aircraft> maybeAircraft = aircraftRepository.findById(flight.getAircraft().getId());
        if (maybeAircraft.isEmpty()) {
            throw new IllegalStateException("Aircraft not found");
        }
        Aircraft assignedAircraft = maybeAircraft.get();
        if (!assignedAircraft.getStatus().equals(AircraftStatus.OPERATIONAL)) {
            throw new IllegalStateException("Aircraft is not operational");
        }
        if (flightRepository.existsOverlappingFlight(flight.getId(), assignedAircraft.getId(), flight.getDepartureTime(), flight.getArrivalTime())) {
            throw new IllegalStateException("Flight overlaps assigned aircraft's existing flight");
        }
        Optional<Flight> maybeLastFlight = flightRepository.findLastFlightBefore(assignedAircraft, flight.getDepartureTime());
        boolean departureAirportUnreachable = false;
        if (maybeLastFlight.isPresent()) {
            Flight lastFlight = maybeLastFlight.get();
            boolean isWithin24Hours = lastFlight.getArrivalTime().isAfter(flight.getDepartureTime().minus(Duration.ofHours(24)));
            boolean isAtWrongAirport = !lastFlight.getArrivalAirport().equals(flight.getDepartureAirport());
            if (isWithin24Hours && isAtWrongAirport) {
                departureAirportUnreachable = true;

            }
        }
        if (departureAirportUnreachable) {
            throw new IllegalStateException("Aircraft cannot reach departure airport");
        }
        int flightDistance = airportService.getDistanceBetween(flight.getDepartureAirport(), flight.getArrivalAirport());
        Optional<AircraftTypeInfo> maybeTypeInfo = aircraftRepository.getAircraftInfo(assignedAircraft.getRegistrationNumber());
        if (maybeTypeInfo.isEmpty()) {
            throw new IllegalStateException("Aircraft type info not found");
        }
        if(flightDistance > maybeTypeInfo.get().getCruisingDistanceMiles()) {
            throw new IllegalStateException("Aircraft doesn't have enough range to complete flight");
        }
    }

    public ZonedDateTime getArrivalTime(@Valid FlightPartialDTO flightDTO) {
        int flightDistance = airportService.getDistanceBetween(flightDTO.departureAirport(), flightDTO.arrivalAirport());
        Optional<AircraftTypeInfo> maybeInfo = aircraftRepository.getAircraftInfo(flightDTO.aircraft());
        if (maybeInfo.isEmpty()) {
            throw new IllegalStateException("Aircraft not found");
        }
        AircraftTypeInfo info = maybeInfo.get();
        int aircraftSpeed = info.getCruisingSpeedKnots();
        int takeoffAndLandingDelay = 20;
        int flightTimeInMinutes = (int)(((double)flightDistance / aircraftSpeed ) * 60) + takeoffAndLandingDelay;
        return flightDTO.departureTime().plusMinutes(flightTimeInMinutes);
    }
}
