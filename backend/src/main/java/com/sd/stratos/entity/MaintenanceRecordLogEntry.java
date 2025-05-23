package com.sd.stratos.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class MaintenanceRecordLogEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID logEntryId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ActionType actionType;

    @Column(nullable = false)
    private UUID maintenanceRecordId;

    @Column(nullable = false)
    private String aircraftRegistrationNumber;

    @Column(nullable = false)
    private String performedBy;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column
    private String changes;

    @Override
    public String toString() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedDate = timestamp.format(formatter);
        String changesText = (changes == null || changes.isBlank()) ? "" : " | Changes: " + changes.trim();

        return String.format("%s -- [%s] By %s on aircraft %s%s",
                formattedDate,
                actionType,
                performedBy,
                aircraftRegistrationNumber,
                changesText);
    }

    public MaintenanceRecordLogEntry(
            ActionType actionType,
            UUID maintenanceRecordId,
            String aircraftRegistrationNumber,
            String performedBy,
            LocalDateTime timestamp,
            String changes
    ) {
        this.actionType = actionType;
        this.maintenanceRecordId = maintenanceRecordId;
        this.aircraftRegistrationNumber = aircraftRegistrationNumber;
        this.performedBy = performedBy;
        this.timestamp = timestamp;
        this.changes = changes;
    }


}
