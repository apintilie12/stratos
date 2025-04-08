package com.sd.stratos.repository;

import com.sd.stratos.entity.Aircraft;
import com.sd.stratos.entity.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.time.ZonedDateTime;
import java.util.UUID;

public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, UUID>, JpaSpecificationExecutor<MaintenanceRecord> {

    @Query("""
        SELECT COUNT(mr) > 0 FROM MaintenanceRecord mr
        WHERE (:id is null or mr.id != :id)
        AND mr.aircraft.id = :aircraft
        AND ((mr.startDate <= :startDate AND :startDate <= mr.endDate) OR
             (:startDate <= mr.startDate AND mr.startDate <= :endDate) OR
             (mr.startDate <= :startDate AND :endDate <= mr.endDate) OR
             (:startDate <= mr.startDate AND mr.endDate <=  :endDate))
    """)
    boolean existsOverlappingMaintenance(UUID id, UUID aircraft, ZonedDateTime startDate, ZonedDateTime endDate);
}
