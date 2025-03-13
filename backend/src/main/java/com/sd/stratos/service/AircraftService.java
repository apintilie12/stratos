package com.sd.stratos.service;

import com.sd.stratos.dto.AircraftCreateDTO;
import com.sd.stratos.dto.AircraftUpdateDTO;
import com.sd.stratos.entity.Aircraft;
import com.sd.stratos.exception.AircraftRegistrationNumberAlreadyExistsException;
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

    public Aircraft addAircraft(AircraftCreateDTO aircraftCreateDTO) {
        if(aircraftRepository.findAircraftByRegistrationNumber(aircraftCreateDTO.registrationNumber())!=null) {
            throw new AircraftRegistrationNumberAlreadyExistsException("Aircraft registration number already exists");
        }
        Aircraft aircraft = new Aircraft();
        aircraft.setRegistrationNumber(aircraftCreateDTO.registrationNumber());
        aircraft.setType(aircraftCreateDTO.type());
        aircraft.setStatus(aircraftCreateDTO.status());
        return aircraftRepository.save(aircraft);
    }

    public Aircraft updateAircraft(UUID id, AircraftUpdateDTO aircraftUpdateDTO) {
        Optional<Aircraft> existingAircraft = aircraftRepository.findById(id);
        if (existingAircraft.isPresent()) {
            Aircraft updatedAircraft = existingAircraft.get();
            updatedAircraft.setType(aircraftUpdateDTO.type());
            updatedAircraft.setRegistrationNumber(aircraftUpdateDTO.registrationNumber());
            updatedAircraft.setStatus(aircraftUpdateDTO.status());
            return aircraftRepository.save(updatedAircraft);
        }
        throw new IllegalStateException("Aircraft not found");
    }

    public void deleteAircraft(UUID id) {
        aircraftRepository.deleteById(id);
    }
}
