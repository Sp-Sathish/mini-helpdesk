package com.helpdesk;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"jwt.secret=test-only-jwt-secret-value-32chars-min",
		"app.admin.password=test-only-admin-password"
})
class HelpdeskApplicationTests {

	@Test
	void contextLoads() {
	}

}
