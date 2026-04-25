package org.example.service;

import org.example.dto.CustomerRequestDTO;
import org.example.dto.CustomerResponseDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional // Rollback changes after each test
public class CustomerServiceIntegrationTest {

    @Autowired
    private CustomerService customerService;


    @Test
    public void testCreateAndRetrieveCustomer() {
        // Arrange
        CustomerRequestDTO request = CustomerRequestDTO.builder()
                .name("Test User")
                .nicNumber("123456789X")
                .dateOfBirth(LocalDate.of(1990, 1, 1))
                .mobileNumbers(new ArrayList<>())
                .addresses(new ArrayList<>())
                .familyMemberIds(new ArrayList<>())
                .build();

        // Act
        CustomerResponseDTO created = customerService.createCustomer(request);

        // Assert
        assertNotNull(created.getId());
        assertEquals("Test User", created.getName());
        
        CustomerResponseDTO retrieved = customerService.getCustomerById(created.getId());
        assertEquals("123456789X", retrieved.getNicNumber());
    }

    @Test
    public void testDuplicateNicThrowsException() {
        // Arrange
        CustomerRequestDTO request = CustomerRequestDTO.builder()
                .name("User 1")
                .nicNumber("DUP123")
                .dateOfBirth(LocalDate.now())
                .build();
        customerService.createCustomer(request);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            customerService.createCustomer(request);
        });
    }
}
