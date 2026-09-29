package com.helpdesk.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.helpdesk.entity.Role;
import com.helpdesk.entity.User;
import com.helpdesk.repository.UserRepository;

@Component
public class AdminSeeder implements ApplicationRunner {

	private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final String adminEmail;
	private final String adminPassword;
	private final String adminName;

	public AdminSeeder(
			UserRepository userRepository,
			PasswordEncoder passwordEncoder,
			@Value("${app.admin.email}") String adminEmail,
			@Value("${app.admin.password}") String adminPassword,
			@Value("${app.admin.name}") String adminName) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.adminEmail = adminEmail;
		this.adminPassword = adminPassword;
		this.adminName = adminName;
	}

	@Override
	public void run(ApplicationArguments args) {
		String email = adminEmail.trim().toLowerCase();
		if (email.isBlank() || adminPassword == null || adminPassword.isBlank()) {
			throw new IllegalStateException("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
		}
		if (userRepository.existsByEmail(email)) {
			log.info("Admin account already exists for {}", email);
			return;
		}
		userRepository.save(new User(adminName.trim(), email, passwordEncoder.encode(adminPassword), Role.ADMIN));
		log.info("Seeded admin account for {}", email);
	}

}
