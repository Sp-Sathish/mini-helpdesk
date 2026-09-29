package com.helpdesk.dto.response;

import java.time.LocalDateTime;

import com.helpdesk.entity.TicketPriority;
import com.helpdesk.entity.TicketStatus;

public record TicketResponse(
		Long id,
		String title,
		String description,
		String category,
		TicketPriority priority,
		TicketStatus status,
		LocalDateTime createdAt,
		LocalDateTime updatedAt,
		UserResponse owner) {
}
