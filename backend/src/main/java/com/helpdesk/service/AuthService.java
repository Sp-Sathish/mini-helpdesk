package com.helpdesk.service;

import java.util.Locale;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.helpdesk.dto.request.LoginRequest;
import com.helpdesk.dto.request.RegisterRequest;
import com.helpdesk.dto.response.AuthResponse;
import com.helpdesk.dto.response.UserResponse;
import com.helpdesk.entity.Role;
import com.helpdesk.entity.User;
import com.helpdesk.exception.EmailAlreadyExistsException;
import com.helpdesk.repository.UserRepository;
import com.helpdesk.security.HelpdeskUserDetails;
import com.helpdesk.security.JwtService;

@Service
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;

	public AuthService(
			UserRepository userRepository,
			PasswordEncoder passwordEncoder,
			AuthenticationManager authenticationManager,
			JwtService jwtService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.authenticationManager = authenticationManager;
		this.jwtService = jwtService;
	}

	public UserResponse register(RegisterRequest request) {
		String email = normalizeEmail(request.email());
		if (userRepository.existsByEmail(email)) {
			throw new EmailAlreadyExistsException();
		}
		User user;
		try {
			user = userRepository.save(new User(
					request.fullName().trim(),
					email,
					passwordEncoder.encode(request.password()),
					Role.USER));
		} catch (DataIntegrityViolationException exception) {
			throw new EmailAlreadyExistsException();
		}
		return toResponse(user);
	}

	public AuthResponse login(LoginRequest request) {
		String email = normalizeEmail(request.email());
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(email, request.password()));
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
		HelpdeskUserDetails principal = new HelpdeskUserDetails(
				user.getId(),
				user.getFullName(),
				user.getEmail(),
				user.getPasswordHash(),
				user.getRole());
		return new AuthResponse(
				jwtService.generateToken(principal),
				"Bearer",
				user.getEmail(),
				user.getFullName(),
				user.getRole());
	}

	public UserResponse currentUser(HelpdeskUserDetails principal) {
		return new UserResponse(
				principal.getId(),
				principal.getFullName(),
				principal.getUsername(),
				principal.getRole());
	}

	private UserResponse toResponse(User user) {
		return new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole());
	}

	private String normalizeEmail(String email) {
		return email.trim().toLowerCase(Locale.ROOT);
	}

}
