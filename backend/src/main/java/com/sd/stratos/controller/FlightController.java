package com.sd.stratos.controller;

import com.sd.stratos.dto.FlightCreateDTO;
import com.sd.stratos.dto.FlightUpdateDTO;
import com.sd.stratos.entity.Flight;
import com.sd.stratos.service.FlightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {
    private final FlightService flightService;

    @GetMapping
    public List<Flight> getAllFlights() {
        return flightService.getAllFlights();
    }

    @GetMapping("/{id}")
    public Flight getFlightById(@PathVariable UUID id) {
        return flightService.getFlightById(id);
    }

    @PostMapping
    public Flight createFlight(@Valid @RequestBody FlightCreateDTO flightDTO) {
        return flightService.addFlight(flightDTO);
    }

    @PutMapping("/{id}")
    public Flight updateFlight(@PathVariable UUID id, @RequestBody FlightUpdateDTO flightUpdateDTO) {
        return flightService.updateFlight(id, flightUpdateDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteFlight(@PathVariable UUID id) {
        flightService.deleteFlight(id);
    }
}
