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
        if (countryRepository.count() > 0) return; // Already initialized

        // Create countries
        Country sriLanka = Country.builder().name("Sri Lanka").build();
        Country india = Country.builder().name("India").build();
        countryRepository.saveAll(Arrays.asList(sriLanka, india));

        // Create cities
        City colombo = City.builder().name("Colombo").country(sriLanka).build();
        City kandy = City.builder().name("Kandy").country(sriLanka).build();
        City mumbai = City.builder().name("Mumbai").country(india).build();
        City delhi = City.builder().name("Delhi").country(india).build();

        cityRepository.saveAll(Arrays.asList(colombo, kandy, mumbai, delhi));
    }
}