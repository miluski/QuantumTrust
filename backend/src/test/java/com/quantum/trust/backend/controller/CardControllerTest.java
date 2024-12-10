package com.quantum.trust.backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
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

import com.quantum.trust.backend.services.CardService;

import jakarta.servlet.http.HttpServletRequest;

class CardControllerTest {

    @Mock
    private CardService cardService;

    @InjectMocks
    private CardController cardController;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(cardController).build();
    }

    @Test
    void testGetAllUserCards() throws Exception {
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(cardService.getResponeWithAllUserCards(request)).thenReturn(ResponseEntity.ok().build());
        mockMvc.perform(get("/api/cards/user/all"))
                .andExpect(status().isOk());
        verify(cardService, times(1)).getResponeWithAllUserCards(any(HttpServletRequest.class));
    }

    @Test
    void testOrderNewCard() throws Exception {
        String encryptedCardDto = "encrypted-card-data";
        when(cardService.orderNewCard(encryptedCardDto)).thenReturn(ResponseEntity.ok().build());
        mockMvc.perform(post("/api/cards/new")
                .contentType(MediaType.APPLICATION_JSON)
                .content(encryptedCardDto))
                .andExpect(status().isOk());
        verify(cardService, times(1)).orderNewCard(encryptedCardDto);
    }

    @Test
    void testSuspendCard() throws Exception {
        String cardId = "12345";
        when(cardService.suspendCard(cardId)).thenReturn(ResponseEntity.ok().build());
        mockMvc.perform(patch("/api/cards/suspend")
                .param("id", cardId))
                .andExpect(status().isOk());
        verify(cardService, times(1)).suspendCard(cardId);
    }

    @Test
    void testUnsuspendCard() throws Exception {
        String cardId = "12345";
        when(cardService.unsuspendCard(cardId)).thenReturn(ResponseEntity.ok().build());
        mockMvc.perform(patch("/api/cards/unsuspend")
                .param("id", cardId))
                .andExpect(status().isOk());
        verify(cardService, times(1)).unsuspendCard(cardId);
    }

    @Test
    void testEditCard() throws Exception {
        String encryptedCardObject = "encrypted-card-data";
        when(cardService.editCard(encryptedCardObject)).thenReturn(ResponseEntity.ok().build());
        mockMvc.perform(patch("/api/cards/edit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(encryptedCardObject))
                .andExpect(status().isOk());
        verify(cardService, times(1)).editCard(encryptedCardObject);
    }
}