package com.quantum.trust.backend.services;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class TokenBucketServiceTest {

    private TokenBucketService tokenBucketService;

    @BeforeEach
    public void setUp() {
        tokenBucketService = new TokenBucketService();
    }

    @Test
    public void testTryConsume_Success() {
        assertTrue(tokenBucketService.tryConsume());
    }

    @Test
    public void testTryConsume_Failure() {
        for (int i = 0; i < 1000; i++) {
            tokenBucketService.tryConsume();
        }
        assertFalse(tokenBucketService.tryConsume());
    }

    @Test
    public void testRefill() throws InterruptedException {
        for (int i = 0; i < 1000; i++) {
            tokenBucketService.tryConsume();
        }
        assertFalse(tokenBucketService.tryConsume());
    }
}