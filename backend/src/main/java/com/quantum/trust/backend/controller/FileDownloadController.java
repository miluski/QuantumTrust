package com.quantum.trust.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quantum.trust.backend.services.MediaService;

/**
 * @controller FileDownloadController
 * @description Controller class for handling file download operations.
 *
 * @class FileDownloadController
 *
 * @constructor
 *              Initializes the FileDownloadController with the specified
 *              MediaService.
 *
 * @method downloadFile - Downloads a file.
 * @param {String} filename - The name of the file to download.
 * @returns {ResponseEntity<?>} - A ResponseEntity containing the file or an
 *          error status.
 */
@RestController
@RequestMapping("/api/media")
public class FileDownloadController {
    private final MediaService mediaService;

    @Autowired
    public FileDownloadController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @GetMapping("/public/{filename:.+}")
    public ResponseEntity<?> downloadFile(@PathVariable String filename) {
        return mediaService.getResponseEntity(filename);
    }
}