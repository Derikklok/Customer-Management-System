package org.example.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.dto.*;
import org.example.entity.*;
import org.example.repository.*;
import org.example.service.CustomerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;

    @Override
    @Transactional
    public CustomerResponseDTO createCustomer(CustomerRequestDTO dto) {
        if (customerRepository.existsByNicNumber(dto.getNicNumber())) {
            throw new IllegalArgumentException("NIC number already exists: " + dto.getNicNumber());
        }

        Customer customer = mapToEntity(dto);
        Customer saved = customerRepository.save(customer);
        return mapToResponseDTO(saved);
    }

    @Override
    @Transactional
    public CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO dto) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found: " + id));

        // Check NIC uniqueness if changed
        if (!existing.getNicNumber().equals(dto.getNicNumber())
                && customerRepository.existsByNicNumber(dto.getNicNumber())) {
            throw new IllegalArgumentException("NIC number already exists: " + dto.getNicNumber());
        }

        existing.setName(dto.getName());
        existing.setDateOfBirth(dto.getDateOfBirth());
        existing.setNicNumber(dto.getNicNumber());
        existing.setMobileNumbers(dto.getMobileNumbers() != null ? dto.getMobileNumbers() : new ArrayList<>());

        // Update addresses
        existing.getAddresses().clear();
        if (dto.getAddresses() != null) {
            existing.getAddresses().addAll(mapAddresses(dto.getAddresses()));
        }

        // Update family members
        existing.getFamilyMembers().clear();
        if (dto.getFamilyMemberIds() != null) {
            List<Customer> familyMembers = customerRepository.findAllById(dto.getFamilyMemberIds());
            existing.getFamilyMembers().addAll(familyMembers);
        }

        Customer updated = customerRepository.save(existing);
        return mapToResponseDTO(updated);
    }

    @Override
    @Transactional
    public CustomerResponseDTO partialUpdateCustomer(Long id, Map<String, Object> updates) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found: " + id));

        updates.forEach((key, value) -> {
            switch (key) {
                case "name":
                    existing.setName((String) value);
                    break;
                case "nicNumber":
                    String nic = (String) value;
                    if (!existing.getNicNumber().equals(nic)
                            && customerRepository.existsByNicNumber(nic)) {
                        throw new IllegalArgumentException("NIC number already exists: " + nic);
                    }
                    existing.setNicNumber(nic);
                    break;
                case "dateOfBirth":
                    if (value instanceof String) {
                        existing.setDateOfBirth(LocalDate.parse((String) value));
                    } else if (value instanceof LocalDate) {
                        existing.setDateOfBirth((LocalDate) value);
                    }
                    break;
                case "mobileNumbers":
                    if (value instanceof List<?>) {
                        List<String> mobileNumbers = ((List<?>) value).stream()
                                .filter(String.class::isInstance)
                                .map(String.class::cast)
                                .collect(Collectors.toList());
                        existing.setMobileNumbers(mobileNumbers);
                    }
                    break;
                // Note: Partial updates to collections like addresses/family members can be complex.
                // Normally handled in separate endpoints or fully replaced here.
            }
        });

        Customer updated = customerRepository.save(existing);
        return mapToResponseDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponseDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findByIdWithAddresses(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found: " + id));
        return mapToResponseDTO(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerResponseDTO> getAllCustomers(Pageable pageable) {
        Page<Customer> page = customerRepository.findAll(pageable);
        List<Long> ids = page.getContent().stream().map(Customer::getId).collect(Collectors.toList());

        if (!ids.isEmpty()) {
            List<Customer> fetched = customerRepository.findByIdsWithAddresses(ids);
            fetched = customerRepository.fetchMobileNumbers(fetched);
            fetched = customerRepository.fetchFamilyMembers(fetched);

            Map<Long, Customer> customerMap = fetched.stream()
                .collect(Collectors.toMap(Customer::getId, c -> c));

            return page.map(c -> mapToResponseDTO(customerMap.get(c.getId())));
        }

        return page.map(this::mapToResponseDTO);
    }

    // ============ Helper Methods ============

    private Customer mapToEntity(CustomerRequestDTO dto) {
        Customer customer = Customer.builder()
                .name(dto.getName())
                .dateOfBirth(dto.getDateOfBirth())
                .nicNumber(dto.getNicNumber())
                .mobileNumbers(dto.getMobileNumbers() != null ? dto.getMobileNumbers() : new ArrayList<>())
                .build();

        if (dto.getAddresses() != null) {
            customer.setAddresses(mapAddresses(dto.getAddresses()));
        }

        if (dto.getFamilyMemberIds() != null) {
            List<Customer> familyMembers = customerRepository.findAllById(dto.getFamilyMemberIds());
            customer.setFamilyMembers(familyMembers);
        }

        return customer;
    }

    private List<Address> mapAddresses(List<AddressDTO> addressDTOs) {
        return addressDTOs.stream().map(dto -> {
            City city = cityRepository.findById(dto.getCityId())
                    .orElseThrow(() -> new EntityNotFoundException("City not found: " + dto.getCityId()));
            Country country = countryRepository.findById(dto.getCountryId())
                    .orElseThrow(() -> new EntityNotFoundException("Country not found: " + dto.getCountryId()));

            return Address.builder()
                    .addressLine1(dto.getAddressLine1())
                    .addressLine2(dto.getAddressLine2())
                    .city(city)
                    .country(country)
                    .build();
        }).collect(Collectors.toList());
    }

    private CustomerResponseDTO mapToResponseDTO(Customer customer) {
        return CustomerResponseDTO.builder()
                .id(customer.getId())
                .name(customer.getName())
                .dateOfBirth(customer.getDateOfBirth())
                .nicNumber(customer.getNicNumber())
                .mobileNumbers(customer.getMobileNumbers() != null ? new ArrayList<>(customer.getMobileNumbers()) : new ArrayList<>())
                .addresses(customer.getAddresses().stream()
                        .map(addr -> AddressResponseDTO.builder()
                                .id(addr.getId())
                                .addressLine1(addr.getAddressLine1())
                                .addressLine2(addr.getAddressLine2())
                                .cityName(addr.getCity() != null ? addr.getCity().getName() : null)
                                .countryName(addr.getCountry() != null ? addr.getCountry().getName() : null)
                                .cityId(addr.getCity() != null ? addr.getCity().getId() : null)
                                .countryId(addr.getCountry() != null ? addr.getCountry().getId() : null)
                                .build())

                        .collect(Collectors.toList()))
                .familyMembers(customer.getFamilyMembers().stream()
                        .map(fm -> FamilyMemberDTO.builder()
                                .id(fm.getId())
                                .name(fm.getName())
                                .nicNumber(fm.getNicNumber())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }


}


