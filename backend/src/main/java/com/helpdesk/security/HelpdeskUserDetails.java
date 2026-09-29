package com.helpdesk.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.helpdesk.entity.Role;

public class HelpdeskUserDetails implements UserDetails {

	private final Long id;
	private final String fullName;
	private final String email;
	private final String passwordHash;
	private final Role role;

	public HelpdeskUserDetails(Long id, String fullName, String email, String passwordHash, Role role) {
		this.id = id;
		this.fullName = fullName;
		this.email = email;
		this.passwordHash = passwordHash;
		this.role = role;
	}

	public Long getId() {
		return id;
	}

	public String getFullName() {
		return fullName;
	}

	public Role getRole() {
		return role;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
	}

	@Override
	public String getPassword() {
		return passwordHash;
	}

	@Override
	public String getUsername() {
		return email;
	}

}
