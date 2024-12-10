package com.quantum.trust.backend.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import com.quantum.trust.backend.model.entities.User;

class MediaServiceTest {

    @Mock
    private CryptoService cryptoService;

    @Mock
    private ValidationService validationService;

    @InjectMocks
    private MediaService mediaService;

    private final String baseDir = "/tmp/media/";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mediaService.baseDir = baseDir;
        new File(baseDir).mkdirs();
    }

    @Test
    void testGetResponseEntity_NotFound() {
        ResponseEntity<?> response = mediaService.getResponseEntity("nonexistentFile.png");
        assertNotNull(response);
        assertEquals(404, response.getStatusCode().value());
    }

    @Test
    void testSaveImage_Success() throws Exception {
        User user = new User();
        String avatarPath = "data:image/png;base64,"
                + Base64.getEncoder().encodeToString("TestImageContent".getBytes());
        doReturn("encryptedPath").when(cryptoService).encryptData(anyString());
        doNothing().when(validationService).validateImage(anyString(), anyLong());
        mediaService.saveImage(user, avatarPath);
        assertNotNull(user.getAvatarPath());
        assertEquals("encryptedPath", user.getAvatarPath());
    }

    @Test
    void testSaveImage_InvalidBase64() {
        User user = new User();
        String invalidAvatarPath = "data:image/png;base64,invalidBase64";
        assertThrows(Exception.class, () -> mediaService.saveImage(user, invalidAvatarPath));
        assertNull(user.getAvatarPath());
    }

    @Test
    void testGetContentType() {
        assertEquals("image/webp", mediaService.getContentType("file.webp"));
        assertEquals("image/x-icon", mediaService.getContentType("file.ico"));
        assertEquals("application/octet-stream", mediaService.getContentType("file.unknown"));
    }

    @Test
    void testGetRandomAvatarName() {
        String image = "data:image/png;base64,";
        String randomName = mediaService.getRandomAvatarName(image);
        assertNotNull(randomName);
        assertTrue(randomName.endsWith(".png"));
    }

    @Test
    void testSetHeaders() throws Exception {
        HttpHeaders headers = new HttpHeaders();
        String mediaPath = "testImage.png";
        Path testFile = Path.of(baseDir, mediaPath);
        if (Files.exists(testFile)) {
            Files.delete(testFile);
        }
        Files.createFile(testFile);
        Files.writeString(testFile, "TestContent");
        Resource mockResource = new UrlResource(testFile.toUri());
        mediaService.setHeaders(mediaPath, mockResource, headers);
        assertTrue(headers.containsKey(HttpHeaders.CONTENT_TYPE));
        assertTrue(headers.containsKey(HttpHeaders.CONTENT_DISPOSITION));
        assertTrue(headers.containsKey(HttpHeaders.CONTENT_LENGTH));
    }
}