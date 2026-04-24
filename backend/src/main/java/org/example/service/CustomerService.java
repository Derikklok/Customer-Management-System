package org.example.service;

import org.example.dto.CustomerRequestDTO;
import org.example.dto.CustomerResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface CustomerService {

    CustomerResponseDTO createCustomer(CustomerRequestDTO dto);

    CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO dto);

    CustomerResponseDTO partialUpdateCustomer(Long id, Map<String, Object> updates);

    CustomerResponseDTO getCustomerById(Long id);

    Page<CustomerResponseDTO> getAllCustomers(Pageable pageable);
}