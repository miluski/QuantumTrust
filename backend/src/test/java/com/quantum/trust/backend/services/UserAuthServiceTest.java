package com.quantum.trust.backend.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.quantum.trust.backend.model.entities.User;
import com.quantum.trust.backend.repositories.UserRepository;

public class UserAuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserAuthService userAuthService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testLoadUserByUsername_UserFound() {
        User user = new User();
        user.setId(1L);
        user.setPassword("password");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserDetails userDetails = userAuthService.loadUserByUsername("1");

        assertEquals("1", userDetails.getUsername());
        assertEquals("password", userDetails.getPassword());
    }

    @Test
    public void testLoadUserByUsername_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> {
            userAuthService.loadUserByUsername("1");
        });
    }
}