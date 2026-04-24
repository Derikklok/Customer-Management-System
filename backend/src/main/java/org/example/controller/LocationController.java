package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.dto.CityDTO;
import org.example.dto.CountryDTO;
import org.example.service.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*") 
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @GetMapping("/countries")
    public ResponseEntity<List<CountryDTO>> getAllCountries() {
        return ResponseEntity.ok(locationService.getAllCountries());
    }

    @GetMapping("/countries/{countryId}/cities")
    public ResponseEntity<List<CityDTO>> getCitiesByCountryId(@PathVariable Long countryId) {
        return ResponseEntity.ok(locationService.getCitiesByCountryId(countryId));
    }
}
