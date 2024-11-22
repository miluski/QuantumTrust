package com.quantum.trust.backend.controller;

import com.quantum.trust.backend.services.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/media")
public class FileDownloadController {
    @Autowired
    private MediaService mediaService;

    @GetMapping("/public/{filename:.+}")
    public ResponseEntity<?> downloadFile(@PathVariable String filename) {
        return mediaService.getResponseEntity(filename);
    }
}