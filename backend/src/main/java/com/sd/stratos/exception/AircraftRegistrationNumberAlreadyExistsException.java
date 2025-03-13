package com.sd.stratos.exception;

public class AircraftRegistrationNumberAlreadyExistsException extends RuntimeException {
    public AircraftRegistrationNumberAlreadyExistsException(String message) {
        super(message);
    }
}
