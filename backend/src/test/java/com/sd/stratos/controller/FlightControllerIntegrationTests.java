package com.sd.stratos.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.sd.stratos.entity.Aircraft;
import com.sd.stratos.entity.AircraftType;
import com.sd.stratos.entity.Flight;
import com.sd.stratos.repository.AircraftRepository;
import com.sd.stratos.repository.FlightRepository;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.TimeZone;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
public class FlightControllerIntegrationTests {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FlightRepository flightRepository;

    private static final String FIXTURE_PATH = "src/test/resources/fixtures/";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private AircraftRepository aircraftRepository;

    @BeforeEach
    public void setUp() throws Exception {
        objectMapper.registerModule(new JavaTimeModule());

        flightRepository.deleteAll();
        flightRepository.flush();

        aircraftRepository.deleteAll();
        aircraftRepository.flush();
        seedDatabase();
    }

    private void seedDatabase() throws Exception {
        String aircraftSeedDataJSON = loadFixture("aircraft-seed.json");
        List<Aircraft> aircraftList = objectMapper.readValue(aircraftSeedDataJSON, new TypeReference<>() {});
        aircraftRepository.saveAll(aircraftList);
        aircraftRepository.flush();

        String seedDataJSON = loadFixture("flights-seed.json");
        List<Flight> flights = objectMapper.readValue(seedDataJSON, new TypeReference<>() {});

        for (Flight flight : flights) {
            Aircraft existingAircraft = aircraftRepository.findAircraftByRegistrationNumber(flight.getAircraft().getRegistrationNumber());
            if (existingAircraft == null) {
                throw new RuntimeException("Aircraft not found: " + flight.getAircraft().getRegistrationNumber());
            }
            flight.setAircraft(existingAircraft);
        }

        flightRepository.saveAll(flights);
    }


    private String loadFixture(String fileName) throws IOException {
        return Files.readString(Paths.get(FIXTURE_PATH + fileName));
    }

    @Test
    void testGetAllFlights() throws Exception {
        mockMvc.perform(get("/api/flights"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("[*].flightNumber",
                        Matchers.containsInAnyOrder("RO564", "RO123")))
                .andExpect(jsonPath("[*].departureAirport",
                        Matchers.containsInAnyOrder("CLJ", "CLJ")))
                .andExpect(jsonPath("[*].arrivalAirport",
                        Matchers.containsInAnyOrder("OTP", "ORY")));
    }

    @Test
    void testAddFlight_ValidFlight() throws Exception {
        String validFlightJSON = loadFixture("valid-flight.json");

        mockMvc.perform(post("/api/flights")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validFlightJSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.flightNumber").value("LH567"))
                .andExpect(jsonPath("$.departureAirport").value("MUC"))
                .andExpect(jsonPath("$.arrivalAirport").value("LHR"));
    }

    @Test
    void testAddFlight_WithOverlappingSchedule_ShouldFail() throws Exception {
        String overlappingFlightJSON = """
    {
        "flightNumber": "LH999",
        "departureAirport": "ORY",
        "arrivalAirport": "LHR",
        "departureTime": "2025-04-13T10:00:00Z",
        "arrivalTime": "2025-04-13T14:00:00Z",
        "aircraft": "EI-HDV"
    }
    """;

        mockMvc.perform(post("/api/flights")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(overlappingFlightJSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Flight overlaps assigned aircraft's existing flight"));
    }


    @Test
    void testUpdateFlight() throws Exception {
        Flight existingFlight = flightRepository.findByFlightNumber("RO123");
        Aircraft existingAircraft = aircraftRepository.findAircraftByRegistrationNumber("EI-HDV");

        String updatedFlightJSON = """
        {
            "id": "%s",
            "flightNumber": "BA789",
            "departureAirport": "LHR",
            "arrivalAirport": "JFK",
            "departureTime": "2025-04-13T07:20:00Z",
            "arrivalTime": "2025-04-13T13:30:00Z",
            "aircraft": {
                "id": "%s",
                "registrationNumber": "EI-HDV"
            }
        }
        """.formatted(existingFlight.getId(), existingAircraft.getId());

        mockMvc.perform(put("/api/flights/" + existingFlight.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedFlightJSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.flightNumber").value("BA789"))
                .andExpect(jsonPath("$.departureAirport").value("LHR"))
                .andExpect(jsonPath("$.arrivalAirport").value("JFK"));

    }

    @Test
    void testAddFlight_WithINOPAircraft_ShouldFail() throws Exception {
        // Given: A flight with an INOP (Retired) aircraft
        String inopFlightJSON = """
    {
        "flightNumber": "LH1000",
        "departureAirport": "ORY",
        "arrivalAirport": "LHR",
        "departureTime": "2025-04-13T15:00:00Z",
        "arrivalTime": "2025-04-13T19:00:00Z",
        "aircraft": "HA-LFY"
    }
    """;

        // When: Trying to add a flight with the INOP aircraft
        mockMvc.perform(post("/api/flights")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(inopFlightJSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Aircraft is not operational"));
    }


    @Test
    void testDeleteFlight() throws Exception {
        Flight existingFlight = flightRepository.findByFlightNumber("RO123");

        mockMvc.perform(delete("/api/flights/" + existingFlight.getId()))
                .andExpect(status().isOk());

        boolean flightExists = flightRepository.findById(existingFlight.getId()).isPresent();
        assertFalse(flightExists, "Flight should be deleted from the database");
    }
}