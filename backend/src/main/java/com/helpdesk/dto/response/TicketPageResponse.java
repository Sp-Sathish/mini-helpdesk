package com.helpdesk.dto.response;

import java.util.List;

public record TicketPageResponse(
		List<TicketResponse> tickets,
		long total,
		int page,
		int size) {
}
