package com.sd.stratos.controller;

import com.sd.stratos.dto.AircraftCreateDTO;
import com.sd.stratos.dto.AircraftUpdateDTO;
import com.sd.stratos.entity.Aircraft;
import com.sd.stratos.service.AircraftService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/aircraft")
@RequiredArgsConstructor
@CrossOrigin
public class AircraftController {
    private final AircraftService aircraftService;

    @GetMapping
    public List<Aircraft> getAllAircrafts() {
        return aircraftService.getAllAircrafts();
    }

    @GetMapping("/{id}")
    public Aircraft getAircraft(@PathVariable UUID id) {
        return aircraftService.getAircraftById(id);
    }

    @PostMapping
    public Aircraft addAircraft(@Valid @RequestBody AircraftCreateDTO aircraftCreateDTO) {
        return aircraftService.addAircraft(aircraftCreateDTO);
    }

    @PutMapping("/{id}")
    public Aircraft updateAircraft(@PathVariable UUID id, @Valid @RequestBody AircraftUpdateDTO aircraftUpdateDTO) {
        return aircraftService.updateAircraft(id, aircraftUpdateDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteAircraft(@PathVariable UUID id) {
        aircraftService.deleteAircraft(id);
    }
}
