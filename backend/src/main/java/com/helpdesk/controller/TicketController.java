package com.helpdesk.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.helpdesk.dto.request.CreateTicketRequest;
import com.helpdesk.dto.request.UpdateTicketStatusRequest;
import com.helpdesk.dto.response.TicketResponse;
import com.helpdesk.security.HelpdeskUserDetails;
import com.helpdesk.service.TicketService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

	private final TicketService ticketService;

	public TicketController(TicketService ticketService) {
		this.ticketService = ticketService;
	}

	@PostMapping
	public ResponseEntity<TicketResponse> create(
			@AuthenticationPrincipal HelpdeskUserDetails actor,
			@Valid @RequestBody CreateTicketRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.create(actor, request));
	}

	@GetMapping
	public List<TicketResponse> list(@AuthenticationPrincipal HelpdeskUserDetails actor) {
		return ticketService.listOwn(actor);
	}

	@GetMapping("/{id}")
	public TicketResponse get(@AuthenticationPrincipal HelpdeskUserDetails actor, @PathVariable Long id) {
		return ticketService.get(actor, id);
	}

	@PatchMapping("/{id}/status")
	public TicketResponse updateStatus(
			@AuthenticationPrincipal HelpdeskUserDetails actor,
			@PathVariable Long id,
			@Valid @RequestBody UpdateTicketStatusRequest request) {
		return ticketService.updateStatus(actor, id, request);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@AuthenticationPrincipal HelpdeskUserDetails actor, @PathVariable Long id) {
		ticketService.delete(actor, id);
		return ResponseEntity.noContent().build();
	}

}
