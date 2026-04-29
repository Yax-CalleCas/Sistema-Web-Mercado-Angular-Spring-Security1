package com.cibertec.dsw1jwt.models;

import java.time.LocalDateTime;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reportes_generales")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteGeneral {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime fechaGeneracion; // Cuándo se guardó
    private Double ingresosTotales;
    private Long puestosOcupados;
    private Long totalPuestos;
    private Double recaudacionServicios;
    private Double deudaTotalPendiente;
    
    // Podemos guardar quién generó el reporte
    private String generadoPor; 
}