package org.example.dto;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyMemberDTO {
    private Long id;
    private String name;
    private String nicNumber;
}