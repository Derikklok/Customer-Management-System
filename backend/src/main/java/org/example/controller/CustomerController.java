package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.dto.CustomerRequestDTO;
import org.example.dto.CustomerResponseDTO;
import org.example.service.CustomerService;
import org.example.service.CustomerBulkService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For React frontend
@SuppressWarnings("null")
public class CustomerController {

    private final CustomerService customerService;
    private final CustomerBulkService customerBulkService;

    @PostMapping
    public ResponseEntity<CustomerResponseDTO> createCustomer(@Valid @RequestBody CustomerRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(customerService.createCustomer(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerRequestDTO dto) {
        return ResponseEntity.ok(customerService.updateCustomer(id, dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> partialUpdateCustomer(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, Object> updates) {
        return ResponseEntity.ok(customerService.partialUpdateCustomer(id, updates));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> getCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @GetMapping
    public ResponseEntity<Page<CustomerResponseDTO>> getAllCustomers(
            @PageableDefault(size = 20, sort = "name") Pageable pageable) {
        return ResponseEntity.ok(customerService.getAllCustomers(pageable));
    }

    @PostMapping("/bulk")
    public ResponseEntity<?> bulkCreateCustomers(@RequestParam("file") MultipartFile file) throws IOException {
        java.io.File tempFile = java.io.File.createTempFile("upload-", ".xlsx");
        file.transferTo(tempFile);
        customerBulkService.bulkCreateFromExcelAsync(tempFile);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(java.util.Collections.singletonMap("message", "File uploaded successfully. Processing started in background."));
    }
}