package com.sd.stratos.config;

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
//    @ResponseStatus(HttpStatus.BAD_REQUEST)
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
//        BindingResult result = ex.getBindingResult();
//        Map<String, String> errorMap = new HashMap<>();
//
//        for (FieldError error : result.getFieldErrors()) {
//            errorMap.put(error.getField(), error.getDefaultMessage());
//        }
//
//        log.error("Validation error: {}", errorMap);
//
//        return errorMap;
//    }

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleUsernameAlreadyExistsException(UsernameAlreadyExistsException ex) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("error", UsernameAlreadyExistsException.class.getSimpleName());
        errorMap.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMap);
    }

}
