package com.cibertec.dsw1jwt.request;

import com.cibertec.dsw1jwt.models.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String username;
    private String password;

    private String nombres;
    private String apellidos;
    private String dni;
    private String telefono;
    private String direccion;
    private Role role;
}