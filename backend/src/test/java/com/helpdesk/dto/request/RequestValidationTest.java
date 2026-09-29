package com.helpdesk.dto.request;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;

import org.junit.jupiter.api.Test;

import com.helpdesk.entity.TicketPriority;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;

class RequestValidationTest {

	private static final Validator VALIDATOR = Validation.buildDefaultValidatorFactory().getValidator();

	@Test
	void createTicketAcceptsNormalAndPaddedValues() {
		CreateTicketRequest normal = new CreateTicketRequest(
				"Printer jam",
				"The lobby printer is jammed.",
				"TECHNICAL",
				TicketPriority.HIGH);
		assertTrue(VALIDATOR.validate(normal).isEmpty());

		CreateTicketRequest padded = new CreateTicketRequest(
				"  Printer jam  ",
				"  The lobby printer is jammed.  ",
				"  TECHNICAL  ",
				TicketPriority.HIGH);
		assertTrue(VALIDATOR.validate(padded).isEmpty());
		assertEquals("Printer jam", padded.title());
		assertEquals("The lobby printer is jammed.", padded.description());
		assertEquals("TECHNICAL", padded.category());
	}

	@Test
	void createTicketRejectsValuesThatAreTooShortAfterTrim() {
		assertViolation(new CreateTicketRequest("  A", validDescription(), "TECHNICAL", TicketPriority.LOW), "title");
		assertViolation(new CreateTicketRequest(validTitle(), "  short  ", "TECHNICAL", TicketPriority.LOW), "description");
		assertViolation(new CreateTicketRequest(validTitle(), validDescription(), " A", TicketPriority.LOW), "category");
		assertViolation(new CreateTicketRequest("   ", validDescription(), "TECHNICAL", TicketPriority.LOW), "title");
	}

	@Test
	void createTicketEnforcesMaximumLengthAfterTrim() {
		assertTrue(VALIDATOR.validate(new CreateTicketRequest(
				" ".repeat(1) + "a".repeat(150),
				validDescription(),
				"TECHNICAL",
				TicketPriority.LOW)).isEmpty());
		assertViolation(new CreateTicketRequest("a".repeat(151), validDescription(), "TECHNICAL", TicketPriority.LOW), "title");
		assertViolation(new CreateTicketRequest(validTitle(), "a".repeat(2001), "TECHNICAL", TicketPriority.LOW), "description");
		assertViolation(new CreateTicketRequest(validTitle(), validDescription(), "a".repeat(51), TicketPriority.LOW), "category");
	}

	@Test
	void registerTrimsNameAndEmailButNotPassword() {
		RegisterRequest padded = new RegisterRequest("  Ann  ", "  ann@example.com  ", "  secret1  ");
		assertTrue(VALIDATOR.validate(padded).isEmpty());
		assertEquals("Ann", padded.fullName());
		assertEquals("ann@example.com", padded.email());
		assertEquals("  secret1  ", padded.password());

		assertViolation(new RegisterRequest(" A", "ann@example.com", "password123"), "fullName");
		assertViolation(new RegisterRequest("Ann", "ann@example.com", "short"), "password");
		assertTrue(VALIDATOR.validate(new RegisterRequest("a".repeat(100), "ann@example.com", "password123")).isEmpty());
		assertViolation(new RegisterRequest("a".repeat(101), "ann@example.com", "password123"), "fullName");
	}

	@Test
	void loginTrimsEmailAndKeepsPassword() {
		LoginRequest padded = new LoginRequest("  ann@example.com  ", "  secret1  ");
		assertTrue(VALIDATOR.validate(padded).isEmpty());
		assertEquals("ann@example.com", padded.email());
		assertEquals("  secret1  ", padded.password());
		assertViolation(new LoginRequest("  not-an-email  ", "password123"), "email");
	}

	private static <T> void assertViolation(T request, String property) {
		Set<ConstraintViolation<T>> violations = VALIDATOR.validate(request);
		assertTrue(violations.stream().anyMatch(violation -> violation.getPropertyPath().toString().equals(property)),
				() -> property + " should be invalid, but violations were " + violations);
	}

	private static String validTitle() {
		return "Printer jam";
	}

	private static String validDescription() {
		return "The lobby printer is jammed.";
	}

}
