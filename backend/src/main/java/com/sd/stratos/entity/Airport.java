package com.sd.stratos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Airport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column
    private String type;

    @Column
    private String name;

    @Column
    private float latitudeDeg;

    @Column
    private float longitudeDeg;

    @Column
    private int elevationFt;

    @Column
    private String continent;

    @Column
    private String isoCountry;

    @Column
    private String isoRegion;

    @Column
    private String municipality;

    @Column
    private boolean scheduledService;

    @Column
    private String icaoCode;

    @Column(unique = true, nullable = false)
    private String iataCode;
}
