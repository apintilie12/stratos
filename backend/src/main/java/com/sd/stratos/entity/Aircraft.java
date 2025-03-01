package com.sd.stratos.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Aircraft {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true,nullable = false)
    private String registrationNumber;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AircraftType type;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AircraftStatus status;
}
