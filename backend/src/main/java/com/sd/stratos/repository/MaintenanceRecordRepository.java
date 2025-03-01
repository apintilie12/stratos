package com.sd.stratos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MaintenanceRecordRepository<MaintenanceRecord> extends JpaRepository<MaintenanceRecord, UUID> {
}
