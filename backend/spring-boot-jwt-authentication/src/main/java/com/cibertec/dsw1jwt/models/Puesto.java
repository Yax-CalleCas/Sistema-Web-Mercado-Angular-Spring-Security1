package com.cibertec.dsw1jwt.models;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "puesto")
public class Puesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String codigo;

    private String ubicacion;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    // Para múltiples fotos, lo ideal es guardar un String largo separado por comas o una tabla aparte.
    // Por simplicidad, usaremos un String largo de URLs separadas por comas.
    @Column(columnDefinition = "TEXT")
    private String fotosGaleria;
    
    @Column(name = "categoria", length = 100)
    private String categoria;

    private boolean activo = true;
    
    @Column(name = "es_asociacion")
    private boolean esAsociacion = false;

    // --- ATRIBUTOS FINANCIEROS ---
    @Column(name = "precio_alquiler")
    private Double precioAlquiler; 

    @Column(name = "servicios_incluidos")
    private boolean serviciosIncluidos = false; 

    @Column(name = "costo_agua_fijo")
    private Double costoAguaFijo = 0.0; 

    @Column(name = "costo_luz_fijo")
    private Double costoLuzFijo = 0.0;
    @Column(name = "estado", length = 20)
    private String estado = "DISPONIBLE"; // Valor inicial para nuevos registros
    // --- RELACIONES ---
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "socio_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "user", "puestos"})
    private Socio socio;

    @Column(name = "imagen_url")
    private String imagenUrl;
}