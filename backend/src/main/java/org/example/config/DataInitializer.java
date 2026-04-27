package org.example.config;

import lombok.RequiredArgsConstructor;
import org.example.entity.City;
import org.example.entity.Country;
import org.example.repository.CityRepository;
import org.example.repository.CountryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
@SuppressWarnings("null")
public class DataInitializer implements CommandLineRunner {

    private final CountryRepository countryRepository;
    private final CityRepository cityRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (countryRepository.count() > 0) return; // Data already exists (likely from data.sql)
        
        // Data is now primarily managed via data.sql
        // This initializer can be used for dynamic data or verification
        
        initializeCountryAndCities("Sri Lanka", Arrays.asList("Colombo", "Kandy"));
        initializeCountryAndCities("India", Arrays.asList("Mumbai", "Delhi"));
    }

    private void initializeCountryAndCities(String countryName, java.util.List<String> cityNames) {
        Country country = countryRepository.findByName(countryName)
                .orElseGet(() -> countryRepository.save(Country.builder().name(countryName).build()));

        for (String cityName : cityNames) {
            if (!cityRepository.existsByNameAndCountry(cityName, country)) {
                cityRepository.save(City.builder().name(cityName).country(country).build());
            }
        }
    }

}