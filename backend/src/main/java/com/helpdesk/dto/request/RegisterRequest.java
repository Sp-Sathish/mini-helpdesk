package com.helpdesk.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
		@NotBlank @Size(min = 2, max = 100) String fullName,
		@NotBlank @Email @Size(max = 150) String email,
		@NotBlank @Size(min = 8, max = 72) String password) {

	public RegisterRequest {
		fullName = trim(fullName);
		email = trim(email);
	}

	private static String trim(String value) {
		return value == null ? null : value.trim();
	}
}
