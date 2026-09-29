package com.helpdesk.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.helpdesk.entity.User;
import com.helpdesk.repository.UserRepository;

@Service
public class HelpdeskUserDetailsService implements UserDetailsService {

	private final UserRepository userRepository;

	public HelpdeskUserDetailsService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) {
		User user = userRepository.findByEmail(username)
				.orElseThrow(() -> new UsernameNotFoundException("Invalid email or password"));
		return new HelpdeskUserDetails(
				user.getId(),
				user.getFullName(),
				user.getEmail(),
				user.getPasswordHash(),
				user.getRole());
	}

}
