package com.sd.stratos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "aircraft_id", foreignKey = @ForeignKey(
            name = "fk_maintenance_aircraft",
            foreignKeyDefinition = "FOREIGN KEY (aircraft_id) REFERENCES aircraft(id) ON DELETE CASCADE"
    ))
    private Aircraft aircraft;

    @ManyToOne(optional = false)
    @JoinColumn(name = "engineer_id", foreignKey = @ForeignKey(
            name = "fk_maintenance_engineer",
            foreignKeyDefinition = "FOREIGN KEY (engineer_id) REFERENCES app_user(id) ON DELETE CASCADE"
    ))
    private User engineer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MaintenanceType type;

    @Column(nullable = false)
    private ZonedDateTime startDate;

    @Column(nullable = false)
    private ZonedDateTime endDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private MaintenanceStatus status;
}
