package com.sd.stratos.controller;

import com.sd.stratos.entity.Airport;
import com.sd.stratos.repository.AirportRepository;
import com.sd.stratos.service.AirportService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airports")
@CrossOrigin
@RequiredArgsConstructor
public class AirportController {

    private final AirportService airportService;

    @GetMapping
    public List<String> getAllIataCodes() {
        return airportService.getAllIataCodes();
    }

    @PostMapping
    public void createAirport(@RequestBody Airport airport) {
        airportService.add(airport);
    }

    @GetMapping("/distance")
    public int getDistanceBetweenAirports(
            @RequestParam String origin,
            @RequestParam String destination
    ) {
        return airportService.getDistanceBetween(origin, destination);
    }

}
