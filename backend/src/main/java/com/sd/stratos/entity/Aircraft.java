package com.sd.stratos.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
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

    @Pattern(regexp = "^[A-Z0-9]{1,2}-[A-Z]{3,4}$", message = "Invalid aircraft registration number format")
    @Column(unique = true,nullable = false)
    private String registrationNumber;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AircraftType type;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AircraftStatus status;
}
