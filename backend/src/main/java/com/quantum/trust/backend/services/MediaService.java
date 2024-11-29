package com.quantum.trust.backend.services;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class MediaService {
    @Value("${media.dir}")
    private String baseDir;

    private final ValidationService validationService;

    @Autowired
    public MediaService(ValidationService validationService) {
        this.validationService = validationService;
    }

    public ResponseEntity<?> getResponseEntity(String mediaPath) {
        try {
            Resource mediaResource = this.getMedia(mediaPath);
            if (mediaResource != null) {
                this.validationService.validateImage(mediaResource.getFilename(), mediaResource.contentLength());
                HttpHeaders headers = new HttpHeaders();
                this.setHeaders(mediaPath, mediaResource, headers);
                return ResponseEntity.status(HttpStatus.OK)
                        .headers(headers)
                        .body(mediaResource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private Resource getMedia(String mediaPath) throws Exception {
        try {
            Path filePath = Paths.get(baseDir).resolve(mediaPath).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            return resource.exists() ? resource : null;
        } catch (Exception e) {
            throw new Exception(e);
        }
    }

    private void setHeaders(String mediaPath, Resource mediaResource, HttpHeaders headers) throws IOException {
        String contentType = this.getContentType(mediaPath);
        long contentLength = mediaResource.contentLength();
        headers.add(HttpHeaders.CONTENT_TYPE, contentType);
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + mediaResource.getFilename() + "\"");
        headers.add(HttpHeaders.CONTENT_LENGTH, String.valueOf(contentLength));
    }

    private String getContentType(String mediaPath) {
        String contentType = "application/octet-stream";
        if (mediaPath.endsWith(".webp")) {
            contentType = "image/webp";
        } else if (mediaPath.endsWith(".ico")) {
            contentType = "image/x-icon";
        }
        return contentType;
    }
}