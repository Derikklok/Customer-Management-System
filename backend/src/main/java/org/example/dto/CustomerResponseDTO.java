package org.example.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerResponseDTO {

    private Long id;
    private String name;
    private LocalDate dateOfBirth;
    private String nicNumber;
    private List<String> mobileNumbers;
    private List<AddressResponseDTO> addresses;
    private List<FamilyMemberDTO> familyMembers;
}