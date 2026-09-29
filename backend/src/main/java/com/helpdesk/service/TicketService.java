package com.helpdesk.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.helpdesk.dto.request.CreateTicketRequest;
import com.helpdesk.dto.request.UpdateTicketStatusRequest;
import com.helpdesk.dto.response.TicketResponse;
import com.helpdesk.entity.Role;
import com.helpdesk.entity.Ticket;
import com.helpdesk.entity.User;
import com.helpdesk.exception.TicketAccessDeniedException;
import com.helpdesk.exception.TicketNotFoundException;
import com.helpdesk.repository.TicketRepository;
import com.helpdesk.repository.UserRepository;
import com.helpdesk.security.HelpdeskUserDetails;

@Service
@Transactional
public class TicketService {

	private final TicketRepository ticketRepository;
	private final UserRepository userRepository;

	public TicketService(TicketRepository ticketRepository, UserRepository userRepository) {
		this.ticketRepository = ticketRepository;
		this.userRepository = userRepository;
	}

	public TicketResponse create(HelpdeskUserDetails actor, CreateTicketRequest request) {
		User owner = userRepository.findById(actor.getId())
				.orElseThrow(() -> new TicketAccessDeniedException("Authentication is required"));
		Ticket ticket = ticketRepository.save(new Ticket(
				request.title().trim(),
				request.description().trim(),
				request.category().trim(),
				request.priority(),
				owner));
		return TicketMapper.toResponse(ticket);
	}

	@Transactional(readOnly = true)
	public List<TicketResponse> listOwn(HelpdeskUserDetails actor) {
		return ticketRepository.findByOwnerIdOrderByUpdatedAtDesc(actor.getId()).stream()
				.map(TicketMapper::toResponse)
				.toList();
	}

	@Transactional(readOnly = true)
	public TicketResponse get(HelpdeskUserDetails actor, Long id) {
		Ticket ticket = findTicket(id);
		assertOwnerOrAdmin(actor, ticket);
		return TicketMapper.toResponse(ticket);
	}

	public TicketResponse updateStatus(HelpdeskUserDetails actor, Long id, UpdateTicketStatusRequest request) {
		Ticket ticket = findTicket(id);
		assertOwnerOrAdmin(actor, ticket);
		ticket.setStatus(request.status());
		ticketRepository.saveAndFlush(ticket);
		return TicketMapper.toResponse(ticket);
	}

	public void delete(HelpdeskUserDetails actor, Long id) {
		Ticket ticket = findTicket(id);
		if (!ticket.getOwner().getId().equals(actor.getId())) {
			throw new TicketAccessDeniedException("You can delete only your own ticket");
		}
		ticketRepository.delete(ticket);
	}

	private Ticket findTicket(Long id) {
		return ticketRepository.findById(id).orElseThrow(TicketNotFoundException::new);
	}

	private void assertOwnerOrAdmin(HelpdeskUserDetails actor, Ticket ticket) {
		boolean owner = ticket.getOwner().getId().equals(actor.getId());
		if (!owner && actor.getRole() != Role.ADMIN) {
			throw new TicketAccessDeniedException("You can only access your own ticket");
		}
	}

}
