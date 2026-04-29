package com.cibertec.dsw1jwt.dto;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SocioReporteDTO {
    private Integer id;
    private String nombreCompleto;
    private String dni;
    private String telefono;
    private Long cantidadPuestos; //  Debe ser Long para el COUNT del Query
    private Double totalPagado;
    private Double totalDeuda;
    private String estado;

    // Constructor manual para asegurar que Hibernate lo encuentre sin problemas
    public SocioReporteDTO(Integer id, String nombreCompleto, String dni, String telefono, 
                            Long cantidadPuestos, Double totalPagado, Double totalDeuda, String estado) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.dni = dni;
        this.telefono = telefono;
        this.cantidadPuestos = cantidadPuestos;
        this.totalPagado = (totalPagado != null) ? totalPagado : 0.0;
        this.totalDeuda = (totalDeuda != null) ? totalDeuda : 0.0;
        this.estado = estado;
    }
}