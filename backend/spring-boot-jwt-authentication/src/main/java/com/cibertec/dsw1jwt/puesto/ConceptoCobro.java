package com.cibertec.dsw1jwt.puesto;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "concepto_cobro")
public class ConceptoCobro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    private String nombre; // Ejemplo: "ALQUILER", "SERVICIO_LUZ", "SERVICIO_AGUA"
    private String descripcion;
}