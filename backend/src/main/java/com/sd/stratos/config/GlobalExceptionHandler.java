package com.sd.stratos.config;

import com.sd.stratos.exception.FlightNumberAlreadyExistsException;
import com.sd.stratos.exception.InvalidFlightEndpointsException;
import com.sd.stratos.exception.InvalidFlightTimesException;
import com.sd.stratos.exception.UsernameAlreadyExistsException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        BindingResult result = ex.getBindingResult();
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("error", MethodArgumentNotValidException.class.getSimpleName());
        errorMap.put("message", result.getFieldError().getDefaultMessage());
        log.error("Validation error: {}", errorMap);
        return errorMap;
    }


    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleUsernameAlreadyExistsException(UsernameAlreadyExistsException ex) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("error", UsernameAlreadyExistsException.class.getSimpleName());
        errorMap.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMap);
    }

    @ExceptionHandler(InvalidFlightTimesException.class)
    public ResponseEntity<Map<String, String>> handleInvalidFlightTimesException(InvalidFlightTimesException ex) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("error", InvalidFlightTimesException.class.getSimpleName());
        errorMap.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMap);
    }

    @ExceptionHandler(FlightNumberAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleFlightNumberAlreadyExistsException(FlightNumberAlreadyExistsException ex) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("error", FlightNumberAlreadyExistsException.class.getSimpleName());
        errorMap.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMap);
    }

    @ExceptionHandler(InvalidFlightEndpointsException.class)
    public ResponseEntity<Map<String, String>> handleInvalidFlightEndpointsException(InvalidFlightEndpointsException ex) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("error", InvalidFlightEndpointsException.class.getSimpleName());
        errorMap.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMap);
    }

}
