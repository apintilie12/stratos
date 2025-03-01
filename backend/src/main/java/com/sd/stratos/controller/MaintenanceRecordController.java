package com.sd.stratos.controller;

import com.sd.stratos.entity.MaintenanceRecord;
import com.sd.stratos.service.MaintenanceRecordService;
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
    public MaintenanceRecord addMaintenanceRecord(@RequestBody MaintenanceRecord maintenanceRecord) {
        return maintenanceRecordService.addMaintenanceRecord(maintenanceRecord);
    }

    @PutMapping("/{id}")
    public MaintenanceRecord updateMaintenanceRecord(@PathVariable UUID id, @RequestBody MaintenanceRecord maintenanceRecord) {
        return maintenanceRecordService.updateMaintenanceRecord(id, maintenanceRecord);
    }

    @DeleteMapping("/{id}")
    public void deleteMaintenanceRecord(@PathVariable UUID id) {
        maintenanceRecordService.deleteMaintenanceRecord(id);
    }
}

