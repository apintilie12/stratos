package com.sd.stratos.repository;

import com.sd.stratos.entity.MaintenanceRecordLogEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MaintenanceRecordLogEntryRepository extends JpaRepository<MaintenanceRecordLogEntry, UUID> {
}
