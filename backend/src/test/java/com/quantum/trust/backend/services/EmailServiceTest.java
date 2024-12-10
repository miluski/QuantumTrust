package com.quantum.trust.backend.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.ClassPathResource;

import com.quantum.trust.backend.model.entities.User;
import com.resend.Resend;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {

    @Mock
    private CryptoService cryptoService;

    @Mock
    private Resend resend;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    public void setUp() {
        emailService = new EmailService(cryptoService);
    }

    @Test
    public void testSendVerificationCode_ShouldThrowExceptionWhenApiKeyIsInvalid() throws Exception {
        String userEmail = "test@example.com";
        String verificationCode = "123456";
        String operation = "register";
        String htmlTemplate = "<html>{{CODE}} {{OPERATION}}</html>";
        mockHtmlTemplate("verification-code", htmlTemplate);
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            emailService.sendVerificationCode(userEmail, verificationCode, operation);
        });
        assertEquals(
                "Failed to send email: 400 {\"statusCode\":400,\"message\":\"API key is invalid\",\"name\":\"validation_error\"}",
                exception.getMessage());
    }

    @Test
    public void testSendIdentificator() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setEmailAddress("encryptedEmail");
        String decryptedEmail = "test@example.com";
        String htmlTemplate = "<html>{{IDENTIFICATOR}}</html>";
        when(cryptoService.decryptData(user.getEmailAddress())).thenReturn(decryptedEmail);
        mockHtmlTemplate("identificator", htmlTemplate);
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            emailService.sendIdentificator(user);
        });
        assertEquals(
                "Failed to send email: 400 {\"statusCode\":400,\"message\":\"API key is invalid\",\"name\":\"validation_error\"}",
                exception.getMessage());
    }

    private void mockHtmlTemplate(String templateType, String htmlTemplate) throws IOException {
        ClassPathResource resource = new ClassPathResource(templateType + ".template.html");
        byte[] bytes = htmlTemplate.getBytes(StandardCharsets.UTF_8);
        Files.write(Paths.get(resource.getURI()), bytes);
    }
}