package com.helpdesk.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.context.RequestAttributeSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtService jwtService;
	private final HelpdeskUserDetailsService userDetailsService;
	private final SecurityContextRepository securityContextRepository = new RequestAttributeSecurityContextRepository();

	public JwtAuthenticationFilter(JwtService jwtService, HelpdeskUserDetailsService userDetailsService) {
		this.jwtService = jwtService;
		this.userDetailsService = userDetailsService;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String header = request.getHeader("Authorization");
		if (header == null || !header.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		String token = header.substring(7).trim();
		try {
			String email = jwtService.extractEmail(token);
			if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
				HelpdeskUserDetails user = (HelpdeskUserDetails) userDetailsService.loadUserByUsername(email);
				if (jwtService.isTokenValid(token, user)) {
					UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
							user,
							null,
							user.getAuthorities());
					authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContext context = SecurityContextHolder.createEmptyContext();
					context.setAuthentication(authentication);
					SecurityContextHolder.setContext(context);
					securityContextRepository.saveContext(context, request, response);
				}
			}
		} catch (JwtException | IllegalArgumentException | UsernameNotFoundException ignored) {
			SecurityContextHolder.clearContext();
		}

		filterChain.doFilter(request, response);
	}

}
