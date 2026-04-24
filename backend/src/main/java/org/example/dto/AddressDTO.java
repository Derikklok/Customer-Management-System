package org.example.dto;

import lombok.*;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDTO {

    private String addressLine1;
    private String addressLine2;

    @NotNull(message = "City is required for address")
    private Long cityId;

    @NotNull(message = "Country is required for address")
    private Long countryId;
}