package com.quantum.trust.backend.services;

import java.time.Instant;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Service;

/**
 * @service TokenBucketService
 * @description Service class for implementing a token bucket rate limiting
 *              algorithm.
 *
 * @class TokenBucketService
 *
 * @constructor
 *              Initializes the token bucket with a specified capacity and
 *              refill rate.
 *
 * @method tryConsume - Attempts to consume a token from the bucket.
 * @returns {boolean} - True if a token was successfully consumed, false
 *          otherwise.
 *
 * @method refill - Refills the token bucket based on the elapsed time since the
 *         last refill.
 */
@Service
public class TokenBucketService {
    private AtomicInteger tokens;
    private Instant lastRefillTime;

    private final int capacity = 1000;
    private final int refillTokens = 1;
    private final long refillIntervalMillis = 2000;

    public TokenBucketService() {
        this.tokens = new AtomicInteger(this.capacity);
        this.lastRefillTime = Instant.now();
    }

    public synchronized boolean tryConsume() {
        refill();
        if (tokens.get() > 0) {
            tokens.decrementAndGet();
            return true;
        }
        return false;
    }

    private void refill() {
        Instant now = Instant.now();
        long millisSinceLastRefill = now.toEpochMilli() - lastRefillTime.toEpochMilli();
        if (millisSinceLastRefill > refillIntervalMillis) {
            int newTokens = (int) (millisSinceLastRefill / refillIntervalMillis) * refillTokens;
            tokens.set(Math.min(capacity, tokens.get() + newTokens));
            lastRefillTime = now;
        }
    }
}
