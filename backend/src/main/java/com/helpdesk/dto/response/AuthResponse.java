package com.helpdesk.dto.response;

import com.helpdesk.entity.Role;

public record AuthResponse(
		String token,
		String tokenType,
		String email,
		String fullName,
		Role role) {
}
