package com.cibertec.dsw1jwt.request;

import lombok.Data;

@Data
public class PuestoRequest {
    private String codigo;
    private String ubicacion;
    private boolean esAsociacion;
    private String descripcion;
    private String fotosGaleria; // "url1,url2,url3"
    private String imagenUrl;
 // En PuestoRequest.java
    private Long socioId; // Cambia Integer por Long aquí también
    // Nuevos atributos para cobros
    private Double precioAlquiler;
    private boolean serviciosIncluidos;
    private Double costoAguaFijo;
    private Double costoLuzFijo;
    private String categoria;
    
 // En PuestoRequest.java
    private String estado;
    private boolean activo;
}