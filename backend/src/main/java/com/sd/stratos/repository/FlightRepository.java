package com.sd.stratos.repository;

import com.sd.stratos.entity.Aircraft;
import com.sd.stratos.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FlightRepository extends JpaRepository<Flight, UUID> {

    Optional<Flight> findByFlightNumber(String flightNumber);

    @Query("""
        SELECT COUNT(f) > 0 FROM Flight f
        WHERE (:id IS NULL or :id <> f.id)
        AND f.aircraft.id = :aircraftId
        AND ((f.departureTime <= :newDepartureTime AND :newDepartureTime <= f.arrivalTime) OR
             (:newDepartureTime <= f.departureTime AND f.departureTime <= :newArrivalTime) OR
             (f.departureTime <= :newDepartureTime AND :newArrivalTime <= f.arrivalTime) OR
             (:newDepartureTime <= f.departureTime AND f.arrivalTime <=  :newArrivalTime))
    """)
    boolean existsOverlappingFlight(UUID id, UUID aircraftId, ZonedDateTime newDepartureTime, ZonedDateTime newArrivalTime);

    @Query("""
        SELECT f FROM Flight f
        WHERE f.aircraft = :aircraft
        AND f.arrivalTime < :departureTime
        ORDER BY f.arrivalTime DESC
        LIMIT 1
    """)
    Optional<Flight> findLastFlightBefore(Aircraft aircraft, ZonedDateTime departureTime);

}
