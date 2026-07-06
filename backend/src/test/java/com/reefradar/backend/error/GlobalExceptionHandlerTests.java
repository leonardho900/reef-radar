package com.reefradar.backend.error;

import com.reefradar.backend.divesite.DiveSiteNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class GlobalExceptionHandlerTests {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void returnsConsistentNotFoundResponse() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/dive-sites/99");

        ResponseEntity<ApiErrorResponse> response = handler.handleResourceNotFound(
                new DiveSiteNotFoundException(99L),
                request
        );

        ApiErrorResponse body = response.getBody();
        assertNotNull(body);
        assertEquals(404, response.getStatusCode().value());
        assertEquals(404, body.status());
        assertEquals("Not Found", body.error());
        assertEquals("Dive site not found with id: 99", body.message());
        assertEquals("/api/dive-sites/99", body.path());
        assertNotNull(body.timestamp());
    }
}
