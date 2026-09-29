package com.helpdesk.service;

import java.util.EnumMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.helpdesk.dto.response.TicketPageResponse;
import com.helpdesk.dto.response.TicketStatsResponse;
import com.helpdesk.entity.Ticket;
import com.helpdesk.entity.TicketPriority;
import com.helpdesk.entity.TicketStatus;
import com.helpdesk.exception.InvalidRequestException;
import com.helpdesk.repository.TicketRepository;
import com.helpdesk.repository.TicketSpecifications;

@Service
@Transactional(readOnly = true)
public class AdminTicketService {

	private static final int DEFAULT_PAGE_SIZE = 10;
	private static final int MAX_PAGE_SIZE = 50;

	private final TicketRepository ticketRepository;

	public AdminTicketService(TicketRepository ticketRepository) {
		this.ticketRepository = ticketRepository;
	}

	public TicketPageResponse list(String title, TicketStatus status, TicketPriority priority, Integer page, Integer size) {
		var specification = TicketSpecifications.filter(title, status, priority);
		Sort sort = Sort.by(Sort.Order.desc("updatedAt"), Sort.Order.desc("id"));
		if (page == null && size == null) {
			var tickets = ticketRepository.findAll(specification, sort).stream()
					.map(TicketMapper::toResponse)
					.toList();
			return new TicketPageResponse(tickets, tickets.size(), 0, tickets.size());
		}
		int pageIndex = page == null ? 0 : page;
		int pageSize = size == null ? DEFAULT_PAGE_SIZE : size;
		if (pageIndex < 0 || pageSize < 1 || pageSize > MAX_PAGE_SIZE) {
			throw new InvalidRequestException("Page must be zero or greater and size must be between 1 and 50");
		}
		Page<Ticket> result = ticketRepository.findAll(specification, PageRequest.of(pageIndex, pageSize, sort));
		return new TicketPageResponse(
				result.getContent().stream().map(TicketMapper::toResponse).toList(),
				result.getTotalElements(),
				result.getNumber(),
				result.getSize());
	}

	public TicketStatsResponse stats() {
		Map<TicketStatus, Long> counts = new EnumMap<>(TicketStatus.class);
		for (Object[] row : ticketRepository.countGroupedByStatus()) {
			counts.put((TicketStatus) row[0], ((Number) row[1]).longValue());
		}
		long open = counts.getOrDefault(TicketStatus.OPEN, 0L);
		long inProgress = counts.getOrDefault(TicketStatus.IN_PROGRESS, 0L);
		long resolved = counts.getOrDefault(TicketStatus.RESOLVED, 0L);
		return new TicketStatsResponse(open + inProgress + resolved, open, inProgress, resolved);
	}

}
