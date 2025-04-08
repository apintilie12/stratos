package com.sd.stratos.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.sd.stratos.entity.*;
import com.sd.stratos.repository.AircraftRepository;
import com.sd.stratos.repository.MaintenanceRecordRepository;
import com.sd.stratos.repository.UserRepository;
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

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
public class MaintenanceRecordControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MaintenanceRecordRepository maintenanceRecordRepository;

    @Autowired
    private AircraftRepository aircraftRepository;

    @Autowired
    private UserRepository userRepository;

    private static final String FIXTURE_PATH = "src/test/resources/fixtures/";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setUp() throws Exception {
        objectMapper.registerModule(new JavaTimeModule());

        maintenanceRecordRepository.deleteAll();
        maintenanceRecordRepository.flush();

        aircraftRepository.deleteAll();
        aircraftRepository.flush();

        userRepository.deleteAll();
        userRepository.flush();

        seedDatabase();
    }

    private void seedDatabase() throws Exception {
        // Seed aircraft
        String aircraftSeedDataJSON = loadFixture("aircraft-seed.json");
        List<Aircraft> aircraftList = objectMapper.readValue(aircraftSeedDataJSON, new TypeReference<>() {});
        aircraftRepository.saveAll(aircraftList);
        aircraftRepository.flush();

        // Seed users
        String userSeedDataJSON = loadFixture("users-seed.json");
        List<User> userList = objectMapper.readValue(userSeedDataJSON, new TypeReference<>() {});
        userRepository.saveAll(userList);
        userRepository.flush();

        // Fetch the Aircraft and User entities after they have been saved
        Aircraft aircraft1 = aircraftRepository.findAircraftByRegistrationNumber("EI-HDV");
        Aircraft aircraft2 = aircraftRepository.findAircraftByRegistrationNumber("HA-LYF");

        User engineer = userRepository.findByUsername("u1");

        // Seed maintenance records
        String maintenanceRecordSeedDataJSON = loadFixture("maintenance-records-seed.json");
        List<MaintenanceRecord> maintenanceRecordList = objectMapper.readValue(maintenanceRecordSeedDataJSON, new TypeReference<>() {});

        int i = 0;
        for (MaintenanceRecord record : maintenanceRecordList) {
            // Set the fully fetched entities
            record.setAircraft(i % 2 == 0 ? aircraft1 : aircraft2);
            record.setEngineer(engineer);
            i++;
        }

        maintenanceRecordRepository.saveAll(maintenanceRecordList);
        maintenanceRecordRepository.flush();
    }

    private String loadFixture(String fileName) throws IOException {
        return Files.readString(Paths.get(FIXTURE_PATH + fileName));
    }

    @Test
    void testGetAllMaintenanceRecords() throws Exception {
        mockMvc.perform(get("/api/maintenance-records"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("[*].aircraft.registrationNumber",
                        Matchers.containsInAnyOrder("EI-HDV", "HA-LYF")))
                .andExpect(jsonPath("[*].status", Matchers.containsInAnyOrder("COMPLETED", "IN_PROGRESS")))
                .andExpect(jsonPath("[*].type", Matchers.containsInAnyOrder("REPAIR", "ROUTINE")));
    }

    @Test
    void testAddMaintenanceRecord_Valid() throws Exception {

        UUID userId = userRepository.findByUsername("u1").getId();

        String validMaintenanceRecordJSON = """
        {
            "aircraft": "EI-HDV",
            "engineer": "%s",
            "startDate": "2025-04-13T10:00:00Z",
            "endDate": "2025-04-13T14:00:00Z",
            "type": "ROUTINE",
            "status": "PENDING"
        }
        """.formatted(userId);

        mockMvc.perform(post("/api/maintenance-records")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validMaintenanceRecordJSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.aircraft.registrationNumber").value("EI-HDV"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void testAddMaintenanceRecord_WithOverlappingMaintenance_ShouldFail() throws Exception {
        UUID userId = userRepository.findByUsername("u1").getId();
        MaintenanceRecord existingMaintenanceRecord = maintenanceRecordRepository.findAll().getFirst();

        String overlappingMaintenanceRecordJSON = """
        {
            "aircraft": "EI-HDV",
            "engineer": "%s",
            "startDate": "%s",
            "endDate": "%s",
            "type": "ROUTINE",
            "status": "PENDING"
        }
        """.formatted(userId, existingMaintenanceRecord.getStartDate().minusHours(2).toString(), existingMaintenanceRecord.getEndDate().plusHours(2).toString());

        mockMvc.perform(post("/api/maintenance-records")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(overlappingMaintenanceRecordJSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Overlaps existing maintenance"));
    }

    @Test
    void testUpdateMaintenanceRecord() throws Exception {
        MaintenanceRecord existingRecord = maintenanceRecordRepository.findAll().getFirst();

        String updatedMaintenanceRecordJSON = """
        {
            "id": "%s",
            "aircraft": "EI-HDV",
            "engineer": "%s",
            "startDate": "2025-04-14T10:00:00Z",
            "endDate": "2025-04-14T14:00:00Z",
            "type": "REPAIR",
            "status": "IN_PROGRESS"
        }
        """.formatted(existingRecord.getId(), existingRecord.getEngineer().getId());

        mockMvc.perform(put("/api/maintenance-records/" + existingRecord.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedMaintenanceRecordJSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.aircraft.registrationNumber").value("EI-HDV"))
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"))
                .andExpect(jsonPath("$.type").value("REPAIR"));
    }

    @Test
    void testDeleteMaintenanceRecord() throws Exception {
        MaintenanceRecord existingRecord = maintenanceRecordRepository.findAll().getFirst();

        mockMvc.perform(delete("/api/maintenance-records/" + existingRecord.getId()))
                .andExpect(status().isOk());

        boolean recordExists = maintenanceRecordRepository.findById(existingRecord.getId()).isPresent();
        assertFalse(recordExists, "Maintenance record should be deleted from the database");
    }

    @Test
    void testGetAllMaintenanceTypes() throws Exception {
        mockMvc.perform(get("/api/maintenance-records/types"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.containsInAnyOrder("ROUTINE", "REPAIR", "OVERHAUL", "INCIDENT")));
    }

    @Test
    void testGetAllMaintenanceStatuses() throws Exception {
        mockMvc.perform(get("/api/maintenance-records/statuses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.containsInAnyOrder("PENDING", "SCHEDULED", "IN_PROGRESS", "COMPLETED")));
    }
}
