package com.irojas.demojwt.socio;

import com.irojas.demojwt.User.Role;
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