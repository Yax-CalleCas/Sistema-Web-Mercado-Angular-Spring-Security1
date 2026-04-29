package com.cibertec.dsw1jwt.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "socios")
public class Socio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nombres;

    @Column(nullable = false)
    private String apellidos;

    @Column(unique = true, nullable = false, length = 8)
    private String dni;

    private String telefono;
    private String direccion;
    private String fotoUrl;

    @Column(nullable = false)
    private boolean activo = true;

    // CAMBIO AQUÍ: Usar EAGER y JsonIgnoreProperties
    @OneToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "user_id", unique = true)
    @JsonIgnoreProperties({"socio", "handler", "hibernateLazyInitializer"}) 
    private User user;
}