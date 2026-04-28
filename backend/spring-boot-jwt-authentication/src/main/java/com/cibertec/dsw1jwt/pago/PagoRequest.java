package com.cibertec.dsw1jwt.pago;



import lombok.Data;

@Data
public class PagoRequest {
    private Long socioId;
    private Integer puestoId;
    private Double monto;
    private String concepto;
}