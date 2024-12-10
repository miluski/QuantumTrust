package com.quantum.trust.backend.services;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.quantum.trust.backend.model.entities.User;

/**
 * @service MediaService
 * @description Service class for handling media-related operations such as
 *              saving and retrieving images.
 *
 * @class MediaService
 *
 * @constructor
 * @param {CryptoService}     cryptoService - Service for handling encryption.
 * @param {ValidationService} validationService - Service for validating images.
 *
 * @method getResponseEntity - Retrieves a media resource and returns it as a
 *         ResponseEntity.
 * @param {String} mediaPath - The path to the media resource.
 * @returns {ResponseEntity<?>} - A ResponseEntity containing the media resource
 *          or an error status.
 *
 * @method saveImage - Saves an image for the specified user.
 * @param {User}   user - The user for whom the image is being saved.
 * @param {String} avatarPath - The base64-encoded image data.
 * @throws {Exception} - If an error occurs while saving the image.
 *
 * @method getMedia - Retrieves a media resource from the specified path.
 * @param {String} mediaPath - The path to the media resource.
 * @returns {Resource} - The media resource.
 * @throws {Exception} - If an error occurs while retrieving the media resource.
 *
 * @method setHeaders - Sets the HTTP headers for the specified media resource.
 * @param {String}      mediaPath - The path to the media resource.
 * @param {Resource}    mediaResource - The media resource.
 * @param {HttpHeaders} headers - The HTTP headers to set.
 * @throws {IOException} - If an error occurs while setting the headers.
 *
 * @method getContentType - Determines the content type for the specified media
 *         path.
 * @param {String} mediaPath - The path to the media resource.
 * @returns {String} - The content type.
 *
 * @method getRandomAvatarName - Generates a random avatar name based on the
 *         specified image data.
 * @param {String} image - The base64-encoded image data.
 * @returns {String} - The generated avatar name.
 */
@Service
public class MediaService {
    @Value("${media.dir}") String baseDir;

    private final CryptoService cryptoService;
    private final ValidationService validationService;

    @Autowired
    public MediaService(CryptoService cryptoService, ValidationService validationService) {
        this.cryptoService = cryptoService;
        this.validationService = validationService;
    }

    @Cacheable("mediaCache")
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

    public void saveImage(User user, String avatarPath) throws Exception {
        String avatarName = this.getRandomAvatarName(avatarPath);
        String filePath = baseDir + avatarName;
        try {
            String base64ImageData = avatarPath.split(",")[1];
            byte[] imageBytes = Base64.getDecoder().decode(base64ImageData);
            FileOutputStream fos = new FileOutputStream(filePath);
            fos.write(imageBytes);
            fos.close();
            Resource mediaResource = this.getMedia(filePath);
            this.validationService.validateImage(mediaResource.getFilename(), mediaResource.contentLength());
            filePath = filePath.replace("/media/", "");
            filePath = this.cryptoService.encryptData(filePath);
            user.setAvatarPath(filePath);
        } catch (Exception e) {
            File file = new File(filePath);
            if (file.exists()) {
                file.delete();
            }
            throw e;
        }
    }

    Resource getMedia(String mediaPath) throws Exception {
        try {
            Path filePath = Paths.get(baseDir).resolve(mediaPath).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            return resource.exists() ? resource : null;
        } catch (Exception e) {
            throw new Exception(e);
        }
    }

    void setHeaders(String mediaPath, Resource mediaResource, HttpHeaders headers) throws IOException {
        String contentType = this.getContentType(mediaPath);
        long contentLength = mediaResource.contentLength();
        headers.add(HttpHeaders.CONTENT_TYPE, contentType);
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + mediaResource.getFilename() + "\"");
        headers.add(HttpHeaders.CONTENT_LENGTH, String.valueOf(contentLength));
    }

    String getContentType(String mediaPath) {
        String contentType = "application/octet-stream";
        if (mediaPath.endsWith(".webp")) {
            contentType = "image/webp";
        } else if (mediaPath.endsWith(".ico")) {
            contentType = "image/x-icon";
        }
        return contentType;
    }

    String getRandomAvatarName(String image) {
        String extension = "";
        if (image.startsWith("data:image/png")) {
            extension = ".png";
        } else if (image.startsWith("data:image/jpeg")) {
            extension = ".jpeg";
        } else if (image.startsWith("data:image/jpg")) {
            extension = ".jpg";
        }
        String uuid = UUID.randomUUID().toString();
        return uuid + extension;
    }
}