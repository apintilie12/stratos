package com.sd.stratos.service;

import com.sd.stratos.dto.FlightCreateDTO;
import com.sd.stratos.dto.FlightDisplayDTO;
import com.sd.stratos.dto.FlightUpdateDTO;
import com.sd.stratos.entity.Aircraft;
import com.sd.stratos.entity.AircraftStatus;
import com.sd.stratos.entity.AircraftType;
import com.sd.stratos.entity.Flight;
import com.sd.stratos.exception.FlightNumberAlreadyExistsException;
import com.sd.stratos.exception.InvalidFlightEndpointsException;
import com.sd.stratos.exception.InvalidTimeIntervalException;
import com.sd.stratos.repository.AircraftRepository;
import com.sd.stratos.repository.FlightRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FlightServiceTests {

    @Mock
    private FlightRepository flightRepository;

    @Mock
    private AircraftRepository aircraftRepository;

    @InjectMocks
    private FlightService flightService;

    @Test
    void testGetAllFlights() {
        /// Given:
        List<Flight> flights = List.of(new Flight(), new Flight());

        /// When:
        when(flightRepository.findAll()).thenReturn(flights);
        List<FlightDisplayDTO> result = flightService.getAllFlights();

        /// Then:
        assertEquals(2, result.size());
        verify(flightRepository, times(1)).findAll();
    }

    @Test
    void testAddFlight() {
        /// Given:
        Aircraft aircraft = new Aircraft(UUID.randomUUID(), "YR-ABC", AircraftType.A320, AircraftStatus.OPERATIONAL);
        FlightCreateDTO flightCreateDTO = new FlightCreateDTO("FL123", "OTP", "JFK", ZonedDateTime.now().plusHours(2), ZonedDateTime.now().plusHours(6), "YR-ABC");
        Flight savedFlight = new Flight(UUID.randomUUID(), "FL123", "OTP", "JFK", flightCreateDTO.departureTime(), flightCreateDTO.arrivalTime(), aircraft);

        /// When:
        when(flightRepository.findByFlightNumber("FL123")).thenReturn(Optional.empty());
        when(aircraftRepository.findById(any())).thenReturn(Optional.of(aircraft));
        when(aircraftRepository.findAircraftByRegistrationNumber(any())).thenReturn(Optional.of(aircraft));
        when(flightRepository.save(any(Flight.class))).thenReturn(savedFlight);
        Flight result = flightService.addFlight(flightCreateDTO);

        /// Then:
        assertEquals(savedFlight, result);
        verify(flightRepository, times(1)).save(any(Flight.class));
    }

    @Test
    void testAddFlightWithExistingFlightNumber() {
        /// Given:
        FlightCreateDTO flightCreateDTO = new FlightCreateDTO("FL123", "OTP", "JFK", ZonedDateTime.now().plusHours(2), ZonedDateTime.now().plusHours(6), "YR-ABC");

        /// When:
        when(flightRepository.findByFlightNumber("FL123")).thenReturn(Optional.of(new Flight()));

        /// Then:
        assertThrows(FlightNumberAlreadyExistsException.class, () -> flightService.addFlight(flightCreateDTO));
        verify(flightRepository, times(1)).findByFlightNumber("FL123");
    }

    @Test
    void testAddFlightWithInvalidTimeInterval() {
        /// Given:
        FlightCreateDTO flightCreateDTO = new FlightCreateDTO("FL124", "OTP", "JFK", ZonedDateTime.now().plusHours(6), ZonedDateTime.now().plusHours(2), "YR-ABC");

        /// When:
        lenient().when(aircraftRepository.findById(any())).thenReturn(Optional.of(new Aircraft()));
        lenient().when(aircraftRepository.findAircraftByRegistrationNumber(any())).thenReturn(Optional.of(new Aircraft()));

        /// Then:
        assertThrows(InvalidTimeIntervalException.class, () -> flightService.addFlight(flightCreateDTO));
    }

    @Test
    void testAddFlightWithSameDepartureAndArrivalAirport() {
        /// Given:
        String registrationNumber = "YR-ABC";
        Aircraft aircraft = new Aircraft(UUID.randomUUID(), registrationNumber, AircraftType.A320, AircraftStatus.OPERATIONAL);

        FlightCreateDTO flightCreateDTO = new FlightCreateDTO(
                "FL125", "OTP", "OTP", ZonedDateTime.now().plusHours(2), ZonedDateTime.now().plusHours(6), registrationNumber
        );

        /// When:
        when(flightRepository.findByFlightNumber("FL125")).thenReturn(Optional.empty());
        when(aircraftRepository.findById(any())).thenReturn(Optional.of(aircraft));
        when(aircraftRepository.findAircraftByRegistrationNumber(registrationNumber)).thenReturn(Optional.of(aircraft));

        /// Then:
        assertThrows(InvalidFlightEndpointsException.class, () -> flightService.addFlight(flightCreateDTO));
    }


    @Test
    void testAddFlightWithOverlappingSchedule() {
        /// Given:
        String registrationNumber = "YR-ABC";
        Aircraft aircraft = new Aircraft(UUID.randomUUID(), registrationNumber, AircraftType.A320, AircraftStatus.OPERATIONAL);

        ZonedDateTime newDeparture = ZonedDateTime.now().plusHours(4);
        ZonedDateTime newArrival = ZonedDateTime.now().plusHours(8);
        FlightCreateDTO overlappingFlightDTO = new FlightCreateDTO(
                "FL999", "OTP", "JFK", newDeparture, newArrival, registrationNumber
        );

        /// When:
        when(flightRepository.findByFlightNumber("FL999")).thenReturn(Optional.empty());
        when(aircraftRepository.findAircraftByRegistrationNumber(registrationNumber)).thenReturn(Optional.of(aircraft));
        when(aircraftRepository.findById(any())).thenReturn(Optional.of(aircraft));
        when(flightRepository.existsOverlappingFlight(null, aircraft.getId(), newDeparture, newArrival)).thenReturn(true);

        /// Then:
        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> flightService.addFlight(overlappingFlightDTO));
        assertEquals("Flight overlaps assigned aircraft's existing flight", ex.getMessage());

        verify(flightRepository).existsOverlappingFlight(null, aircraft.getId(), newDeparture, newArrival);
    }



    @Test
    void testUpdateFlight() {
        /// Given:
        UUID flightId = UUID.randomUUID();
        String registrationNumber = "YR-ABC";
        Aircraft aircraft = new Aircraft(UUID.randomUUID(), registrationNumber, AircraftType.A320, AircraftStatus.OPERATIONAL);

        ZonedDateTime departureTime = ZonedDateTime.now().plusHours(3);
        ZonedDateTime arrivalTime = ZonedDateTime.now().plusHours(7);

        FlightUpdateDTO flightUpdateDTO = new FlightUpdateDTO(
                flightId, "FL126", "OTP", "JFK", departureTime, arrivalTime, aircraft.getRegistrationNumber()
        );

        Flight existingFlight = new Flight(
                flightId, "FL126", "OTP", "LHR", ZonedDateTime.now().plusHours(2), ZonedDateTime.now().plusHours(6), aircraft
        );

        Flight updatedFlight = new Flight(
                flightId, "FL126", "OTP", "JFK", departureTime, arrivalTime, aircraft
        );

        /// When:
        when(flightRepository.findById(flightId)).thenReturn(Optional.of(existingFlight));
        when(aircraftRepository.findById(aircraft.getId())).thenReturn(Optional.of(aircraft));
        lenient().when(aircraftRepository.findAircraftByRegistrationNumber(registrationNumber)).thenReturn(Optional.of(aircraft));
        when(flightRepository.existsOverlappingFlight(existingFlight.getId(), aircraft.getId(), departureTime, arrivalTime)).thenReturn(false);
        when(flightRepository.findLastFlightBefore(aircraft, departureTime)).thenReturn(Optional.empty());
        when(flightRepository.save(any(Flight.class))).thenReturn(updatedFlight);

        /// Then:
        Flight result = flightService.updateFlight(flightId, flightUpdateDTO);
        assertEquals(updatedFlight, result);
        verify(flightRepository, times(1)).findById(flightId);
        verify(flightRepository, times(1)).save(any(Flight.class));
    }


    @Test
    void testDeleteFlight() {
        /// Given:
        UUID flightId = UUID.randomUUID();

        /// When:
        doNothing().when(flightRepository).deleteById(flightId);
        flightService.deleteFlight(flightId);

        /// Then:
        verify(flightRepository, times(1)).deleteById(flightId);
    }
}
