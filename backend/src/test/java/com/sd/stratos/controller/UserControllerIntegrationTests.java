package com.sd.stratos.controller;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sd.stratos.entity.User;
import com.sd.stratos.entity.UserRole;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
public class UserControllerIntegrationTests {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    private static final String FIXTURE_PATH="src/test/resources/fixtures/";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setUp() throws Exception {
        userRepository.deleteAll();
        userRepository.flush();
        seedDatabase();
    }

    private void seedDatabase() throws Exception {
        String seedDataJSON = loadFixture("users-seed.json");
        List<User> users = objectMapper.readValue(seedDataJSON, new TypeReference<List<User>>() {});
        userRepository.saveAll(users);
    }

    private String loadFixture(String fileName) throws IOException {
        return Files.readString(Paths.get(FIXTURE_PATH + fileName));
    }

    @Test
    void testGetAllUsers() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("[*].username",
                        Matchers.containsInAnyOrder("u1", "u2", "admin" )))
                .andExpect(jsonPath("[*].password",
                        Matchers.containsInAnyOrder("u1", "u2", "admin")))
                .andExpect(jsonPath("[*].role",
                        Matchers.containsInAnyOrder("ADMIN", "ENGINEER", "PILOT")));
    }

    @Test
    void testAddUser_ValidUser() throws Exception {
        String validUserJSON = loadFixture("valid-user.json");

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validUserJSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.username").value("newUsername"))
                .andExpect(jsonPath("$.password").value("password"))
                .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    void addUser_InvalidUser() throws Exception {
        String invalidUserJSON = loadFixture("invalid-user.json");

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidUserJSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Username already exists"));
    }

    @Test
    void updateUser() throws Exception {
        User existingUser = userRepository.findByUsername("u1");

        String updatedUserJSON = """
        {
            "id": "%s",
            "username": "updatedUser",
            "password": "newPassword",
            "role": "PILOT"
        }
    """.formatted(existingUser.getId());

        mockMvc.perform(put("/api/users/" + existingUser.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedUserJSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(existingUser.getId().toString()))
                .andExpect(jsonPath("$.username").value("updatedUser"))
                .andExpect(jsonPath("$.password").value("newPassword"))
                .andExpect(jsonPath("$.role").value("PILOT"));

        User updatedUser = userRepository.findById(existingUser.getId()).orElseThrow();
        assertEquals("updatedUser", updatedUser.getUsername());
        assertEquals("newPassword", updatedUser.getPassword());
        assertEquals(UserRole.PILOT, updatedUser.getRole());
    }

    @Test
    void testDeleteUser() throws Exception {
        User existingUser = userRepository.findByUsername("u1");

        mockMvc.perform(delete("/api/users/" + existingUser.getId()))
                .andExpect(status().isOk()); // HTTP 204 No Content

        boolean userExists = userRepository.findById(existingUser.getId()).isPresent();
        assertFalse(userExists, "User should be deleted from the database");
    }


}
