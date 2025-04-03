package com.sd.stratos.repository;

import com.sd.stratos.entity.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AirportRepository extends JpaRepository<Airport, UUID> {
    Optional<Airport> findByIataCode(String iataCode);

    @Query("SELECT a.iataCode FROM Airport a")
    List<String> findAllIataCodes();
}
