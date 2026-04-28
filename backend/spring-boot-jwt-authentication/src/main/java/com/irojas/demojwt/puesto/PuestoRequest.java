package com.irojas.demojwt.puesto;

import lombok.Data;

@Data
public class PuestoRequest {
    private String codigo;
    private String ubicacion;
    private boolean esAsociacion;
    private String imagenUrl;
 // En PuestoRequest.java
    private Long socioId; // Cambia Integer por Long aquí también
    // Nuevos atributos para cobros
    private Double precioAlquiler;
    private boolean serviciosIncluidos;
    private Double costoAguaFijo;
    private Double costoLuzFijo;
    private String categoria;
}