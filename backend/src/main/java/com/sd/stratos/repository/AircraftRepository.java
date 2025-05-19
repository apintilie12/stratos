package com.sd.stratos.repository;

import com.sd.stratos.entity.Aircraft;
import com.sd.stratos.entity.AircraftTypeInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AircraftRepository extends JpaRepository<Aircraft, UUID> {
    Optional<Aircraft> findAircraftByRegistrationNumber(String registrationNumber);

    @Query("SELECT ati from Aircraft a join AircraftTypeInfo ati on a.type = ati.aircraftType " +
           "where a.registrationNumber = :registrationNumber")
    Optional<AircraftTypeInfo> getAircraftInfo(String registrationNumber);
}
