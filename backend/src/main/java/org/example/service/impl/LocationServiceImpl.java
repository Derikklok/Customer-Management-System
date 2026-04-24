package org.example.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.dto.CityDTO;
import org.example.dto.CountryDTO;
import org.example.repository.CityRepository;
import org.example.repository.CountryRepository;
import org.example.service.LocationService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {

    private final CountryRepository countryRepository;
    private final CityRepository cityRepository;

    @Override
    public List<CountryDTO> getAllCountries() {
        return countryRepository.findAll().stream()
                .map(country -> CountryDTO.builder()
                        .id(country.getId())
                        .name(country.getName())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<CityDTO> getCitiesByCountryId(Long countryId) {
        return cityRepository.findByCountryId(countryId).stream()
                .map(city -> CityDTO.builder()
                        .id(city.getId())
                        .name(city.getName())
                        .build())
                .collect(Collectors.toList());
    }
}
