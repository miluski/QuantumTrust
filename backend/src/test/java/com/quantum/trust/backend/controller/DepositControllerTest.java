package com.quantum.trust.backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.quantum.trust.backend.services.DepositService;

import jakarta.servlet.http.HttpServletRequest;

class DepositControllerTest {

    @Mock
    private DepositService depositService;

    @InjectMocks
    private DepositController depositController;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(depositController).build();
    }

    @Test
    void testGetAllUserDeposits() throws Exception {
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(depositService.getAllUserDeposits(request)).thenReturn(ResponseEntity.ok().build());
        mockMvc.perform(get("/api/deposits/user/all"))
                .andExpect(status().isOk());
        verify(depositService, times(1)).getAllUserDeposits(any(HttpServletRequest.class));
    }

    @Test
    void testOpenNewDeposit() throws Exception {
        HttpServletRequest request = mock(HttpServletRequest.class);
        String encryptedDepositDto = "encrypted-deposit-data";
        when(depositService.saveNewDeposit(request, encryptedDepositDto))
                .thenReturn(ResponseEntity.ok().build());
        mockMvc.perform(post("/api/deposits/new")
                .contentType(MediaType.APPLICATION_JSON)
                .content(encryptedDepositDto))
                .andExpect(status().isOk());
        verify(depositService, times(1)).saveNewDeposit(any(HttpServletRequest.class), eq(encryptedDepositDto));
    }
}