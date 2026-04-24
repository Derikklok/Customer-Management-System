package org.example.dto;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponseDTO {
    private Long id;
    private String addressLine1;
    private String addressLine2;
    private String cityName;
    private String countryName;
    private Long cityId;
    private Long countryId;
}