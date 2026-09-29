package com.helpdesk.dto.request;

import com.helpdesk.entity.TicketStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateTicketStatusRequest(@NotNull TicketStatus status) {
}
