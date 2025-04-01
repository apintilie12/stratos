package com.sd.stratos.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sd.stratos.entity.Aircraft;
import com.sd.stratos.entity.AircraftStatus;
import com.sd.stratos.entity.AircraftType;
import com.sd.stratos.repository.AircraftRepository;
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
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
public class AircraftControllerIntegrationTests {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AircraftRepository aircraftRepository;

    private static final String FIXTURE_PATH = "src/test/resources/fixtures/";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setUp() throws Exception {
        aircraftRepository.deleteAll();
        aircraftRepository.flush();
        seedDatabase();
    }

    private void seedDatabase() throws Exception {
        String seedDataJSON = loadFixture("aircraft-seed.json");
        List<Aircraft> aircraftList = objectMapper.readValue(seedDataJSON, new TypeReference<>() {});
        aircraftRepository.saveAll(aircraftList);
    }

    private String loadFixture(String fileName) throws IOException {
        return Files.readString(Paths.get(FIXTURE_PATH + fileName));
    }

    @Test
    void testGetAllAircrafts() throws Exception {
        mockMvc.perform(get("/api/aircraft"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("[*].registrationNumber", Matchers.containsInAnyOrder("HA-LYF", "HA-LFY", "EI-HDV")))
                .andExpect(jsonPath("[*].type", Matchers.containsInAnyOrder("B737", "A320", "A320")))
                .andExpect(jsonPath("[*].status", Matchers.containsInAnyOrder("OPERATIONAL", "IN_MAINTENANCE", "RETIRED")));
    }

    @Test
    void testAddAircraft_ValidAircraft() throws Exception {
        String validAircraftJSON = loadFixture("valid-aircraft.json");

        mockMvc.perform(post("/api/aircraft")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validAircraftJSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.registrationNumber").value("YR-SKY"))
                .andExpect(jsonPath("$.type").value("A320"))
                .andExpect(jsonPath("$.status").value("OPERATIONAL"));
    }

    @Test
    void testUpdateAircraft() throws Exception {
        Aircraft existingAircraft = aircraftRepository.findAll().getFirst();

        String updatedAircraftJSON = """
        {
            "id": "%s",
            "registrationNumber": "%s",
            "type": "A340",
            "status": "IN_MAINTENANCE"
        }
        """.formatted(existingAircraft.getId(), existingAircraft.getRegistrationNumber());

        mockMvc.perform(put("/api/aircraft/" + existingAircraft.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedAircraftJSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(existingAircraft.getId().toString()))
                .andExpect(jsonPath("$.registrationNumber").value(existingAircraft.getRegistrationNumber()))
                .andExpect(jsonPath("$.type").value("A340"))
                .andExpect(jsonPath("$.status").value("IN_MAINTENANCE"));
    }

    @Test
    void testDeleteAircraft() throws Exception {
        Aircraft existingAircraft = aircraftRepository.findAll().getFirst();
        UUID aircraftId = existingAircraft.getId();

        mockMvc.perform(delete("/api/aircraft/" + aircraftId))
                .andExpect(status().isOk());

        boolean aircraftExists = aircraftRepository.findById(aircraftId).isPresent();
        assertFalse(aircraftExists, "Aircraft should be deleted from the database");
    }

    @Test
    void testGetAllAircraftTypes() throws Exception {
        mockMvc.perform(get("/api/aircraft/types"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(AircraftType.values().length));
    }

    @Test
    void testGetAllAircraftStatuses() throws Exception {
        mockMvc.perform(get("/api/aircraft/statuses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(AircraftStatus.values().length));
    }
}
