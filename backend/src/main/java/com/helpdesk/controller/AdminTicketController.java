package com.helpdesk.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.helpdesk.dto.request.UpdateTicketStatusRequest;
import com.helpdesk.dto.response.TicketPageResponse;
import com.helpdesk.dto.response.TicketResponse;
import com.helpdesk.dto.response.TicketStatsResponse;
import com.helpdesk.entity.TicketPriority;
import com.helpdesk.entity.TicketStatus;
import com.helpdesk.security.HelpdeskUserDetails;
import com.helpdesk.service.AdminTicketService;
import com.helpdesk.service.TicketService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/tickets")
public class AdminTicketController {

	private final AdminTicketService adminTicketService;
	private final TicketService ticketService;

	public AdminTicketController(AdminTicketService adminTicketService, TicketService ticketService) {
		this.adminTicketService = adminTicketService;
		this.ticketService = ticketService;
	}

	@GetMapping("/stats")
	public TicketStatsResponse stats() {
		return adminTicketService.stats();
	}

	@GetMapping
	public TicketPageResponse list(
			@RequestParam(required = false) String title,
			@RequestParam(required = false) TicketStatus status,
			@RequestParam(required = false) TicketPriority priority,
			@RequestParam(required = false) Integer page,
			@RequestParam(required = false) Integer size) {
		return adminTicketService.list(title, status, priority, page, size);
	}

	@PatchMapping("/{id}/status")
	public TicketResponse updateStatus(
			@AuthenticationPrincipal HelpdeskUserDetails actor,
			@PathVariable Long id,
			@Valid @RequestBody UpdateTicketStatusRequest request) {
		return ticketService.updateStatus(actor, id, request);
	}

}
