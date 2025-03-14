package com.sd.stratos.controller;

import com.sd.stratos.dto.MaintenanceRecordCreateDTO;
import com.sd.stratos.dto.MaintenanceRecordUpdateDTO;
import com.sd.stratos.entity.MaintenanceRecord;
import com.sd.stratos.service.MaintenanceRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/maintenance-records")
@RequiredArgsConstructor
public class MaintenanceRecordController {
    private final MaintenanceRecordService maintenanceRecordService;

    @GetMapping
    public List<MaintenanceRecord> getMaintenanceRecords() {
        return maintenanceRecordService.getMaintenanceRecords();
    }

    @GetMapping("/{id}")
    public MaintenanceRecord getMaintenanceRecord(@PathVariable UUID id) {
        return maintenanceRecordService.getMaintenanceRecordById(id);
    }

    @PostMapping
    public MaintenanceRecord addMaintenanceRecord(@Valid @RequestBody MaintenanceRecordCreateDTO maintenanceRecordCreateDTO) {
        return maintenanceRecordService.addMaintenanceRecord(maintenanceRecordCreateDTO);
    }

    @PutMapping("/{id}")
    public MaintenanceRecord updateMaintenanceRecord(@PathVariable UUID id,@Valid @RequestBody MaintenanceRecordUpdateDTO maintenanceRecordUpdateDTO) {
        return maintenanceRecordService.updateMaintenanceRecord(id, maintenanceRecordUpdateDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteMaintenanceRecord(@PathVariable UUID id) {
        maintenanceRecordService.deleteMaintenanceRecord(id);
    }
}

