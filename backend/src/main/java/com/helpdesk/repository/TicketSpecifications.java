package com.helpdesk.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.data.jpa.domain.Specification;

import com.helpdesk.entity.Ticket;
import com.helpdesk.entity.TicketPriority;
import com.helpdesk.entity.TicketStatus;

import jakarta.persistence.criteria.Predicate;

public final class TicketSpecifications {

	private TicketSpecifications() {
	}

	public static Specification<Ticket> filter(String title, TicketStatus status, TicketPriority priority) {
		return (root, query, builder) -> {
			List<Predicate> predicates = new ArrayList<>();
			if (title != null && !title.isBlank()) {
				String pattern = "%" + escapeLike(title.trim().toLowerCase(Locale.ROOT)) + "%";
				predicates.add(builder.like(builder.lower(root.get("title")), pattern, '\\'));
			}
			if (status != null) {
				predicates.add(builder.equal(root.get("status"), status));
			}
			if (priority != null) {
				predicates.add(builder.equal(root.get("priority"), priority));
			}
			if (predicates.isEmpty()) {
				return builder.conjunction();
			}
			return builder.and(predicates.toArray(Predicate[]::new));
		};
	}

	private static String escapeLike(String value) {
		return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
	}

}
