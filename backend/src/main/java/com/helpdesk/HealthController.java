package com.helpdesk;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class HealthController {

	private final DataSource dataSource;

	public HealthController(DataSource dataSource) {
		this.dataSource = dataSource;
	}

	@GetMapping("/health")
	public Map<String, String> health() {
		try (Connection connection = dataSource.getConnection()) {
			return Map.of(
					"status", "UP",
					"database", connection.getCatalog());
		} catch (SQLException exception) {
			throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Database is unavailable");
		}
	}

}
