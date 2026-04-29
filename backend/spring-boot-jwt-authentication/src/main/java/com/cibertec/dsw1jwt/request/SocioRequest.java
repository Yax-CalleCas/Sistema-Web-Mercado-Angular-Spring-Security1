package com.cibertec.dsw1jwt.request;

import com.cibertec.dsw1jwt.models.Role;

import lombok.Data;

@Data
public class SocioRequest {

    private String nombres;
    private String apellidos;
    private String dni;
    private String telefono;
    private String direccion;
    private String fotoUrl;

    // USER
    private String username;
    private String password;
    private Role role;
}