package com.sd.stratos.service;

import com.sd.stratos.dto.MaintenanceRecordCreateDTO;
import com.sd.stratos.dto.MaintenanceRecordUpdateDTO;
import com.sd.stratos.entity.*;
import com.sd.stratos.exception.InvalidTimeIntervalException;
import com.sd.stratos.repository.AircraftRepository;
import com.sd.stratos.repository.MaintenanceRecordLogEntryRepository;
import com.sd.stratos.repository.MaintenanceRecordRepository;
import com.sd.stratos.repository.UserRepository;
import com.sd.stratos.specification.MaintenanceRecordSpecification;
import com.sd.stratos.util.MaintenanceRecordDiffUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MaintenanceRecordService {
    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final AircraftRepository aircraftRepository;
    private final UserRepository userRepository;
    private final MaintenanceRecordLogEntryRepository maintenanceRecordLogEntryRepository;

    public List<MaintenanceRecord> getMaintenanceRecords(
            MaintenanceStatus status,
            MaintenanceType type,
            UUID engineerId,
            UUID aircraftId,
            String sortBy,
            String order
    ) {
        Specification<MaintenanceRecord> spec = Specification.where(
                MaintenanceRecordSpecification.hasStatus(status)
                        .and(MaintenanceRecordSpecification.hasType(type))
                        .and(MaintenanceRecordSpecification.hasEngineer(engineerId))
                        .and(MaintenanceRecordSpecification.hasAircraft(aircraftId))
        );

        Sort sort = Sort.by(
                "desc".equalsIgnoreCase(order) ? Sort.Direction.DESC : Sort.Direction.ASC,
                sortBy != null ? sortBy : "startDate"
        );

        return maintenanceRecordRepository.findAll(spec, sort);
    }


    public MaintenanceRecord getMaintenanceRecordById(UUID id) {
        return maintenanceRecordRepository.findById(id).orElse(null);
    }

    public MaintenanceRecord addMaintenanceRecord(MaintenanceRecordCreateDTO maintenanceRecordCreateDTO) {
        MaintenanceRecord maintenanceRecord = new MaintenanceRecord();
        Optional<Aircraft> maybeAircraft = aircraftRepository.findAircraftByRegistrationNumber(maintenanceRecordCreateDTO.aircraft());
        if (maybeAircraft.isEmpty()) {
            throw new IllegalStateException("Aircraft not found");
        }
        maintenanceRecord.setAircraft(maybeAircraft.get());
        Optional<User> maybeUser = userRepository.findById(maintenanceRecordCreateDTO.engineer());
        if (maybeUser.isEmpty()) {
            throw new IllegalStateException("User not found");
        }
        maintenanceRecord.setEngineer(maybeUser.get());
        maintenanceRecord.setStartDate(maintenanceRecordCreateDTO.startDate());
        maintenanceRecord.setEndDate(maintenanceRecordCreateDTO.endDate());
        maintenanceRecord.setType(maintenanceRecordCreateDTO.type());
        maintenanceRecord.setStatus(maintenanceRecordCreateDTO.status());
        validateMaintenanceRecord(maintenanceRecord);
        MaintenanceRecord result = maintenanceRecordRepository.save(maintenanceRecord);
        MaintenanceRecordLogEntry maintenanceRecordLogEntry = new MaintenanceRecordLogEntry(ActionType.CREATED, result.getId(), result.getAircraft().getRegistrationNumber(), result.getEngineer().getUsername(), LocalDateTime.now(), "");
        maintenanceRecordLogEntryRepository.save(maintenanceRecordLogEntry);
        return result;
    }

    public MaintenanceRecord updateMaintenanceRecord(UUID id, MaintenanceRecordUpdateDTO maintenanceRecord) {
        Optional<MaintenanceRecord> existingMaintenanceRecord = maintenanceRecordRepository.findById(id);
        if (existingMaintenanceRecord.isPresent()) {
            MaintenanceRecord updatedMaintenanceRecord = existingMaintenanceRecord.get();
            MaintenanceRecord originalCopy = copyRecord(updatedMaintenanceRecord);
            Optional<Aircraft> maybeAircraft = aircraftRepository.findAircraftByRegistrationNumber(maintenanceRecord.aircraft());
            if(maybeAircraft.isEmpty()) {
                throw new IllegalStateException("Aircraft not found");
            }
            updatedMaintenanceRecord.setAircraft(maybeAircraft.get());
            Optional<User> maybeEngineer = userRepository.findById(UUID.fromString(maintenanceRecord.engineer()));
            if(maybeEngineer.isEmpty()) {
                throw new IllegalStateException("User not found");
            }
            updatedMaintenanceRecord.setEngineer(maybeEngineer.get());
            updatedMaintenanceRecord.setType(maintenanceRecord.type());
            updatedMaintenanceRecord.setStatus(maintenanceRecord.status());
            updatedMaintenanceRecord.setStartDate(maintenanceRecord.startDate());
            updatedMaintenanceRecord.setEndDate(maintenanceRecord.endDate());
            validateMaintenanceRecord(updatedMaintenanceRecord);
            MaintenanceRecord result = maintenanceRecordRepository.save(updatedMaintenanceRecord);
            MaintenanceRecordLogEntry maintenanceRecordLogEntry = new MaintenanceRecordLogEntry(ActionType.UPDATED, result.getId(), result.getAircraft().getRegistrationNumber(), result.getEngineer().getUsername(), LocalDateTime.now(), MaintenanceRecordDiffUtil.diffRecords(originalCopy, result));
            maintenanceRecordLogEntryRepository.save(maintenanceRecordLogEntry);
            return result;
        }
        throw new IllegalStateException("Could not find maintenance record with id: " + id);
    }

    public void deleteMaintenanceRecord(UUID id) {
        MaintenanceRecord maintenanceRecord = maintenanceRecordRepository.findById(id).orElse(null);
        if (maintenanceRecord != null) {
            MaintenanceRecordLogEntry maintenanceRecordLogEntry = new MaintenanceRecordLogEntry(ActionType.DELETED, maintenanceRecord.getId(), maintenanceRecord.getAircraft().getRegistrationNumber(),maintenanceRecord.getEngineer().getUsername(), LocalDateTime.now(), "");
            maintenanceRecordLogEntryRepository.save(maintenanceRecordLogEntry);
            maintenanceRecordRepository.deleteById(id);
        }
    }

    private void validateMaintenanceRecord(MaintenanceRecord maintenanceRecord) {
        if (maintenanceRecord == null) {
            return;
        }
        if (maintenanceRecord.getStartDate().isAfter(maintenanceRecord.getEndDate())) {
            throw new InvalidTimeIntervalException("Start date after end date");
        }
        if (maintenanceRecordRepository.existsOverlappingMaintenance(
                maintenanceRecord.getId(),
                maintenanceRecord.getAircraft().getId(),
                maintenanceRecord.getStartDate(),
                maintenanceRecord.getEndDate())) {
            throw new IllegalStateException("Overlaps existing maintenance");
        }
    }

    public List<MaintenanceType> getAllMaintenanceTypes() {
        return List.of(MaintenanceType.values());
    }

    public List<MaintenanceStatus> getAllMaintenanceStatuses() {
        return List.of(MaintenanceStatus.values());
    }

    private static MaintenanceRecord copyRecord(MaintenanceRecord record) {
        MaintenanceRecord copy = new MaintenanceRecord();
        copy.setId(record.getId());
        copy.setAircraft(record.getAircraft());
        copy.setEngineer(record.getEngineer());
        copy.setType(record.getType());
        copy.setStatus(record.getStatus());
        copy.setStartDate(record.getStartDate());
        copy.setEndDate(record.getEndDate());
        return copy;
    }

}
