package com.quantum.trust.backend.controller;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.quantum.trust.backend.services.MediaService;

class FileDownloadControllerTest {

    @Mock
    private MediaService mediaService;

    @InjectMocks
    private FileDownloadController fileDownloadController;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(fileDownloadController).build();
    }

    @Test
    void testDownloadFile_Success() throws Exception {
        String filename = "example.txt";
        when(mediaService.getResponseEntity(filename)).thenReturn(ResponseEntity.ok().build());
        mockMvc.perform(get("/api/media/public/" + filename))
                .andExpect(status().isOk());
        verify(mediaService, times(1)).getResponseEntity(filename);
    }

    @Test
    void testDownloadFile_NotFound() throws Exception {
        String filename = "missingfile.txt";
        when(mediaService.getResponseEntity(filename)).thenReturn(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        mockMvc.perform(get("/api/media/public/" + filename))
                .andExpect(status().isNotFound());
        verify(mediaService, times(1)).getResponseEntity(filename);
    }
}