package com.sd.stratos.service;

import com.sd.stratos.entity.MaintenanceRecord;
import com.sd.stratos.repository.MaintenanceRecordRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MaintenanceRecordService {
    private final MaintenanceRecordRepository maintenanceRecordRepository;

    public List<MaintenanceRecord> getMaintenanceRecords() {
        return maintenanceRecordRepository.findAll();
    }

    public MaintenanceRecord getMaintenanceRecordById(UUID id) {
        return maintenanceRecordRepository.findById(id).orElse(null);
    }

    public MaintenanceRecord addMaintenanceRecord(MaintenanceRecord maintenanceRecord) {
        return maintenanceRecordRepository.save(maintenanceRecord);
    }

    public MaintenanceRecord updateMaintenanceRecord(UUID id, MaintenanceRecord maintenanceRecord) {
        Optional<MaintenanceRecord> existingMaintenanceRecord = maintenanceRecordRepository.findById(id);
        if (existingMaintenanceRecord.isPresent()) {
            MaintenanceRecord updatedMaintenanceRecord = existingMaintenanceRecord.get();
            updatedMaintenanceRecord.setAircraft(maintenanceRecord.getAircraft());
            updatedMaintenanceRecord.setType(maintenanceRecord.getType());
            updatedMaintenanceRecord.setStatus(maintenanceRecord.getStatus());
            updatedMaintenanceRecord.setStartDate(maintenanceRecord.getStartDate());
            updatedMaintenanceRecord.setEndDate(maintenanceRecord.getEndDate());
            return maintenanceRecordRepository.save(updatedMaintenanceRecord);
        }
        throw new IllegalStateException("Could not find maintenance record with id: " + id);
    }

    public void deleteMaintenanceRecord(UUID id) {
        maintenanceRecordRepository.deleteById(id);
    }

}
