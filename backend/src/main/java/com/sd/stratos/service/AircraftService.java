package com.sd.stratos.service;

import com.sd.stratos.entity.Aircraft;
import com.sd.stratos.repository.AircraftRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AircraftService {

    private final AircraftRepository aircraftRepository;

    public List<Aircraft> getAllAircrafts() {
        return aircraftRepository.findAll();
    }

    public Aircraft getAircraftById(UUID id) {
        return aircraftRepository.findById(id).orElse(null);
    }

    public Aircraft addAircraft(Aircraft aircraft) {
        return aircraftRepository.save(aircraft);
    }

    public Aircraft updateAircraft(UUID id, Aircraft aircraft) {
        Optional<Aircraft> existingAircraft = aircraftRepository.findById(id);
        if (existingAircraft.isPresent()) {
            Aircraft updatedAircraft = existingAircraft.get();
            updatedAircraft.setType(aircraft.getType());
            updatedAircraft.setRegistrationNumber(aircraft.getRegistrationNumber());
            updatedAircraft.setStatus(aircraft.getStatus());
            return aircraftRepository.save(updatedAircraft);
        }
        throw new IllegalStateException("Aircraft not found");
    }

    public void deleteAircraft(UUID id) {
        aircraftRepository.deleteById(id);
    }
}
