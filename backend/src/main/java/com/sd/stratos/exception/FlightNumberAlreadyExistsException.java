package com.sd.stratos.exception;

public class FlightNumberAlreadyExistsException extends RuntimeException {
    public FlightNumberAlreadyExistsException(String message) {
        super(message);
    }
}
