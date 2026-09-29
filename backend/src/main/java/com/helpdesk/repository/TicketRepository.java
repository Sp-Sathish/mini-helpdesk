package com.helpdesk.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.helpdesk.entity.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Long>, JpaSpecificationExecutor<Ticket> {

	List<Ticket> findByOwnerIdOrderByUpdatedAtDesc(Long ownerId);

	@Query("select t.status, count(t) from Ticket t group by t.status")
	List<Object[]> countGroupedByStatus();

}
