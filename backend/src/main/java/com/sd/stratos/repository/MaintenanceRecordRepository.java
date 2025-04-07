package com.sd.stratos.repository;

import com.sd.stratos.entity.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, UUID>, JpaSpecificationExecutor<MaintenanceRecord> {
}
