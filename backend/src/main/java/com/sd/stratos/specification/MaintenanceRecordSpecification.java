package com.sd.stratos.specification;

import com.sd.stratos.entity.MaintenanceRecord;
import com.sd.stratos.entity.MaintenanceStatus;
import com.sd.stratos.entity.MaintenanceType;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class MaintenanceRecordSpecification {

    public static Specification<MaintenanceRecord> hasStatus(MaintenanceStatus status) {
        return (root, query, cb) ->
                status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<MaintenanceRecord> hasType(MaintenanceType type) {
        return (root, query, cb) ->
                type == null ? null : cb.equal(root.get("type"), type);
    }

    public static Specification<MaintenanceRecord> hasEngineer(UUID engineerId) {
        return (root, query, cb) ->
                engineerId == null ? null : cb.equal(root.get("engineer").get("id"), engineerId);
    }

    public static Specification<MaintenanceRecord> hasAircraft(UUID aircraftId) {
        return (root, query, cb) ->
                aircraftId == null ? null : cb.equal(root.get("aircraft").get("id"), aircraftId);
    }
}
