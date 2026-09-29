package com.helpdesk.exception;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.helpdesk.dto.response.ApiErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException exception) {
		Map<String, String> errors = new LinkedHashMap<>();
		exception.getBindingResult().getFieldErrors()
				.forEach(error -> errors.putIfAbsent(error.getField(), error.getDefaultMessage()));
		return error(HttpStatus.BAD_REQUEST, "Validation failed", errors);
	}

	@ExceptionHandler(EmailAlreadyExistsException.class)
	public ResponseEntity<ApiErrorResponse> handleDuplicateEmail(EmailAlreadyExistsException exception) {
		return error(HttpStatus.CONFLICT, exception.getMessage(), Map.of());
	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<ApiErrorResponse> handleBadCredentials(BadCredentialsException exception) {
		return error(HttpStatus.UNAUTHORIZED, "Invalid email or password", Map.of());
	}

	@ExceptionHandler(TicketNotFoundException.class)
	public ResponseEntity<ApiErrorResponse> handleTicketNotFound(TicketNotFoundException exception) {
		return error(HttpStatus.NOT_FOUND, exception.getMessage(), Map.of());
	}

	@ExceptionHandler(TicketAccessDeniedException.class)
	public ResponseEntity<ApiErrorResponse> handleTicketAccessDenied(TicketAccessDeniedException exception) {
		return error(HttpStatus.FORBIDDEN, exception.getMessage(), Map.of());
	}

	@ExceptionHandler(InvalidRequestException.class)
	public ResponseEntity<ApiErrorResponse> handleInvalidRequest(InvalidRequestException exception) {
		return error(HttpStatus.BAD_REQUEST, exception.getMessage(), Map.of());
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ApiErrorResponse> handleUnreadable(HttpMessageNotReadableException exception) {
		return error(HttpStatus.BAD_REQUEST, "Request body is invalid", Map.of());
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<ApiErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException exception) {
		return error(HttpStatus.BAD_REQUEST, "Request is invalid", Map.of());
	}

	private ResponseEntity<ApiErrorResponse> error(HttpStatus status, String message, Map<String, String> errors) {
		return ResponseEntity.status(status)
				.body(new ApiErrorResponse(Instant.now(), status.value(), message, errors));
	}

}
