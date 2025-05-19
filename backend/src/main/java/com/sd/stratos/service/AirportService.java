package com.sd.stratos.service;

import com.sd.stratos.entity.Airport;
import com.sd.stratos.repository.AirportRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AirportService {
    private final AirportRepository airportRepository;

    public List<String> getAllIataCodes() {
        return airportRepository.findAllIataCodes();
    }

    public void add(Airport airport) {
        airportRepository.save(airport);
    }

    public int getDistanceBetween(String originIata, String destinationIata) {
        Airport origin = airportRepository.findByIataCode(originIata).orElse(null);
        Airport destination = airportRepository.findByIataCode(destinationIata).orElse(null);
        if (origin == null || destination == null) {
            return -1;
        }
        return haversine(origin, destination);
    }

    private int haversine(Airport origin, Airport destination) {
        final int R = 6371;
        double latRad1 = Math.toRadians(origin.getLatitudeDeg());
        double latRad2 = Math.toRadians(destination.getLatitudeDeg());
        double lonRad1 = Math.toRadians(origin.getLongitudeDeg());
        double lonRad2 = Math.toRadians(destination.getLongitudeDeg());
        double deltaLat = latRad2 - latRad1;
        double deltaLon = lonRad2 - lonRad1;
        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
                   + Math.cos(latRad1) * Math.cos(latRad2)
                     * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        final double kmToNauticalMiles = 1.8;
        return (int)Math.round(R * c / kmToNauticalMiles);
    }
}
