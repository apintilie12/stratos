package com.sd.stratos.repository;

import com.sd.stratos.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FlightRepository extends JpaRepository<Flight, UUID> {

    Flight findByFlightNumber(String flightNumber);

}
