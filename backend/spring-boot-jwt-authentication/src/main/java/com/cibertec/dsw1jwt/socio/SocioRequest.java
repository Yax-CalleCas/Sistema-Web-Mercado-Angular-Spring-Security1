package com.cibertec.dsw1jwt.socio;

import com.cibertec.dsw1jwt.User.Role;

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