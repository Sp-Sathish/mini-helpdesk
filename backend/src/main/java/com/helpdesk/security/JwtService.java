package com.helpdesk.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private final SecretKey secretKey;
	private final long expirationMs;

	public JwtService(
			@Value("${jwt.secret}") String secret,
			@Value("${jwt.expiration-ms}") long expirationMs) {
		if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
			throw new IllegalStateException("JWT_SECRET must be at least 32 characters");
		}
		this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
		this.expirationMs = expirationMs;
	}

	public String generateToken(HelpdeskUserDetails user) {
		Date now = new Date();
		return Jwts.builder()
				.subject(user.getUsername())
				.claim("userId", user.getId())
				.claim("role", user.getRole().name())
				.issuedAt(now)
				.expiration(new Date(now.getTime() + expirationMs))
				.signWith(secretKey)
				.compact();
	}

	public String extractEmail(String token) {
		return extractAllClaims(token).getSubject();
	}

	public boolean isTokenValid(String token, HelpdeskUserDetails user) {
		String email = extractEmail(token);
		return email.equals(user.getUsername()) && !isExpired(token);
	}

	private boolean isExpired(String token) {
		return extractAllClaims(token).getExpiration().before(new Date());
	}

	private Claims extractAllClaims(String token) {
		return Jwts.parser()
				.verifyWith(secretKey)
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}

}
