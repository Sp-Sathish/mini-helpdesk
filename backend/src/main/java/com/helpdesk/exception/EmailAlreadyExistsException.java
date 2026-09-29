package com.helpdesk.exception;

public class EmailAlreadyExistsException extends RuntimeException {

	public EmailAlreadyExistsException() {
		super("Email is already registered");
	}

}
