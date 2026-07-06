package com.reefradar.backend.error;

import java.time.Instant;
import java.util.stream.Collectors;

import com.reefradar.backend.auth.InvalidCredentialsException;
import com.reefradar.backend.divelog.DiveLogNotFoundException;
import com.reefradar.backend.divesite.DiveSiteNotFoundException;
import com.reefradar.backend.species.SpeciesNotFoundException;
import com.reefradar.backend.user.EmailAlreadyRegisteredException;
import com.reefradar.backend.user.UserNotFoundException;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler({
                        DiveSiteNotFoundException.class,
                        DiveLogNotFoundException.class,
                        SpeciesNotFoundException.class,
                        UserNotFoundException.class
        })
        public ResponseEntity<ApiErrorResponse> handleResourceNotFound(
                        RuntimeException exception,
                        HttpServletRequest request) {
                return buildResponse(
                                HttpStatus.NOT_FOUND,
                                exception.getMessage(),
                                request.getRequestURI());
        }

        @ExceptionHandler(MethodArgumentTypeMismatchException.class)
        public ResponseEntity<ApiErrorResponse> handleTypeMismatch(
                        MethodArgumentTypeMismatchException exception,
                        HttpServletRequest request) {
                String message = "Invalid value '%s' for parameter '%s'"
                                .formatted(exception.getValue(), exception.getName());

                return buildResponse(
                                HttpStatus.BAD_REQUEST,
                                message,
                                request.getRequestURI());
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ApiErrorResponse> handleValidation(
                        MethodArgumentNotValidException exception,
                        HttpServletRequest request) {
                String message = exception.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                                .sorted()
                                .collect(Collectors.joining(", "));

                return buildResponse(
                                HttpStatus.BAD_REQUEST,
                                message,
                                request.getRequestURI());
        }

        @ExceptionHandler(EmailAlreadyRegisteredException.class)
        public ResponseEntity<ApiErrorResponse> handleEmailAlreadyRegistered(
                        EmailAlreadyRegisteredException exception,
                        HttpServletRequest request) {
                return buildResponse(
                                HttpStatus.CONFLICT,
                                exception.getMessage(),
                                request.getRequestURI());
        }

        @ExceptionHandler(InvalidCredentialsException.class)
        public ResponseEntity<ApiErrorResponse> handleInvalidCredentials(
                        InvalidCredentialsException exception,
                        HttpServletRequest request) {
                return buildResponse(
                                HttpStatus.UNAUTHORIZED,
                                exception.getMessage(),
                                request.getRequestURI());
        }

        private ResponseEntity<ApiErrorResponse> buildResponse(
                        HttpStatus status,
                        String message,
                        String path) {
                ApiErrorResponse body = new ApiErrorResponse(
                                Instant.now(),
                                status.value(),
                                status.getReasonPhrase(),
                                message,
                                path);

                return ResponseEntity.status(status).body(body);
        }
}