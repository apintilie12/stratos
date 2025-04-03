package com.sd.stratos.controller;

import com.sd.stratos.entity.Airport;
import com.sd.stratos.repository.AirportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airports")
@CrossOrigin
@RequiredArgsConstructor
public class AirportController {

    private final AirportRepository airportRepository;

    @GetMapping
    public List<Airport> getAllAirports() {
        return airportRepository.findAll();
    }

    @PostMapping
    public void createAirport(@RequestBody Airport airport) {
        airportRepository.save(airport);
    }
}
