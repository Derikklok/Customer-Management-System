package org.example.service;

import org.example.dto.CityDTO;
import org.example.dto.CountryDTO;

import java.util.List;

public interface LocationService {
    List<CountryDTO> getAllCountries();
    List<CityDTO> getCitiesByCountryId(Long countryId);
}
