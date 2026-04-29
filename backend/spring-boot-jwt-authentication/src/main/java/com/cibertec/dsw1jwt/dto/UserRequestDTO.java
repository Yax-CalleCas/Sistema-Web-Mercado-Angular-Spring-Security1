package com.cibertec.dsw1jwt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDTO {
    private Integer id;
    private String username;
    private String password; // Solo se usa al crear o si se quiere cambiar
    private String role;     // ADMIN, USER, CAJERO
    private boolean enabled;
}