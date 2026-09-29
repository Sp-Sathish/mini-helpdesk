package com.helpdesk.service;

import com.helpdesk.dto.response.TicketResponse;
import com.helpdesk.dto.response.UserResponse;
import com.helpdesk.entity.Ticket;
import com.helpdesk.entity.User;

final class TicketMapper {

	private TicketMapper() {
	}

	static TicketResponse toResponse(Ticket ticket) {
		User owner = ticket.getOwner();
		return new TicketResponse(
				ticket.getId(),
				ticket.getTitle(),
				ticket.getDescription(),
				ticket.getCategory(),
				ticket.getPriority(),
				ticket.getStatus(),
				ticket.getCreatedAt(),
				ticket.getUpdatedAt(),
				new UserResponse(owner.getId(), owner.getFullName(), owner.getEmail(), owner.getRole()));
	}

}
