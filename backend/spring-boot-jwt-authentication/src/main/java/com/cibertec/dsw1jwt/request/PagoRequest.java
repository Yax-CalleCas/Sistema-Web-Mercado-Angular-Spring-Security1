package com.cibertec.dsw1jwt.request;



import lombok.Data;

@Data
public class PagoRequest {
    private Long socioId;
    private Integer puestoId;
    private Double monto;
    private String concepto;
}