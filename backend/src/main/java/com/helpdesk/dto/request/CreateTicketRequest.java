package com.helpdesk.dto.request;

import com.helpdesk.entity.TicketPriority;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateTicketRequest(
		@NotBlank @Size(min = 3, max = 150) String title,
		@NotBlank @Size(min = 10, max = 2000) String description,
		@NotBlank @Size(min = 2, max = 50) String category,
		@NotNull TicketPriority priority) {

	public CreateTicketRequest {
		title = trim(title);
		description = trim(description);
		category = trim(category);
	}

	private static String trim(String value) {
		return value == null ? null : value.trim();
	}
}
