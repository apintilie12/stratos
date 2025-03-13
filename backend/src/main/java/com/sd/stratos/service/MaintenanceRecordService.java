package com.sd.stratos.service;

import com.sd.stratos.dto.MaintenanceRecordCreateDTO;
import com.sd.stratos.dto.MaintenanceRecordUpdateDTO;
import com.sd.stratos.entity.MaintenanceRecord;
import com.sd.stratos.exception.InvalidTimeIntervalException;
import com.sd.stratos.repository.MaintenanceRecordRepository;
import lombok.RequiredArgsConstructor;
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

    public MaintenanceRecord addMaintenanceRecord(MaintenanceRecordCreateDTO maintenanceRecordCreateDTO) {
        MaintenanceRecord maintenanceRecord = new MaintenanceRecord();
        maintenanceRecord.setAircraft(maintenanceRecordCreateDTO.aircraft());
        maintenanceRecord.setEngineer(maintenanceRecordCreateDTO.engineer());
        maintenanceRecord.setStartDate(maintenanceRecordCreateDTO.startDate());
        maintenanceRecord.setEndDate(maintenanceRecordCreateDTO.endDate());
        maintenanceRecord.setType(maintenanceRecordCreateDTO.type());
        maintenanceRecord.setStatus(maintenanceRecordCreateDTO.status());
        validateMaintenanceRecord(maintenanceRecord);
        return maintenanceRecordRepository.save(maintenanceRecord);
    }

    public MaintenanceRecord updateMaintenanceRecord(UUID id, MaintenanceRecordUpdateDTO maintenanceRecord) {
        Optional<MaintenanceRecord> existingMaintenanceRecord = maintenanceRecordRepository.findById(id);
        if (existingMaintenanceRecord.isPresent()) {
            MaintenanceRecord updatedMaintenanceRecord = existingMaintenanceRecord.get();
            updatedMaintenanceRecord.setAircraft(maintenanceRecord.aircraft());
            updatedMaintenanceRecord.setEngineer(maintenanceRecord.engineer());
            updatedMaintenanceRecord.setType(maintenanceRecord.type());
            updatedMaintenanceRecord.setStatus(maintenanceRecord.status());
            updatedMaintenanceRecord.setStartDate(maintenanceRecord.startDate());
            updatedMaintenanceRecord.setEndDate(maintenanceRecord.endDate());
            validateMaintenanceRecord(updatedMaintenanceRecord);
            return maintenanceRecordRepository.save(updatedMaintenanceRecord);
        }
        throw new IllegalStateException("Could not find maintenance record with id: " + id);
    }

    public void deleteMaintenanceRecord(UUID id) {
        maintenanceRecordRepository.deleteById(id);
    }

    private void validateMaintenanceRecord(MaintenanceRecord maintenanceRecord) {
        if(maintenanceRecord == null) {
            return;
        }
        if(maintenanceRecord.getStartDate().isAfter(maintenanceRecord.getEndDate())) {
            throw new InvalidTimeIntervalException("Start date after end date");
        }
    }

}
