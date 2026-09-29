package com.helpdesk.dto.response;

public record TicketStatsResponse(
		long total,
		long open,
		long inProgress,
		long resolved) {
}
