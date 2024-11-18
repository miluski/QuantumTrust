package com.quantum.trust.backend.services;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.quantum.trust.backend.model.entities.User;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;

@Service
public class EmailService {
    @Value("${resend.api.key}")
    private String resendApiKey;

    public boolean sendVerificationCode(String userEmail, String verificationCode, String operation) {
        try {
            String htmlTemplate = this.getHtmlTemplate("verification-code");
            htmlTemplate = htmlTemplate.replace("{{CODE}}", verificationCode);
            htmlTemplate = htmlTemplate.replace("{{OPERATION}}", operation);
            return this.sendEmail(userEmail, "Kod uwierzytelniający", htmlTemplate);
        } catch (ResendException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean sendIdentificator(User user) {
        try {
            String htmlTemplate = this.getHtmlTemplate("identificator");
            htmlTemplate = htmlTemplate.replace("{{IDENTIFICATOR}}", user.getId().toString());
            return this.sendEmail(user.getEmailAddress(), "Twój osobisty identyfikator do konta QuantumTrust",
                    htmlTemplate);
        } catch (ResendException e) {
            e.printStackTrace();
            return false;
        }
    }

    private boolean sendEmail(String userEmail, String subject, String htmlTemplate) throws ResendException {
        if (!htmlTemplate.equals("")) {
            Resend resend = new Resend(resendApiKey);
            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from("QuantumTrust <noreply@quantum-trust.cc>")
                    .to(userEmail)
                    .subject(subject)
                    .html(htmlTemplate)
                    .build();
            resend.emails().send(params);
            return true;
        } else {
            System.out.println("Bad html template");
            return false;
        }
    }

    private String getHtmlTemplate(String templateType) {
        try {
            ClassPathResource resource = new ClassPathResource(templateType + ".template.html");
            byte[] bytes = Files.readAllBytes(Paths.get(resource.getURI()));
            return new String(bytes, StandardCharsets.UTF_8);
        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
    }

}
