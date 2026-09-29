package com.helpdesk.dto.response;

import com.helpdesk.entity.Role;

public record UserResponse(
		Long id,
		String fullName,
		String email,
		Role role) {
}
