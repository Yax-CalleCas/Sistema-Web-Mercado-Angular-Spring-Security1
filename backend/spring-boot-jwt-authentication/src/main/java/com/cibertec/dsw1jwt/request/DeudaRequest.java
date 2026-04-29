package com.cibertec.dsw1jwt.request;

import lombok.Data;

@Data
public class DeudaRequest {

    private Double monto;
    private String fechaVencimiento;
    private String mesReferencia;

    private Long socioId;
    private Long puestoId;
    private Long conceptoId;
}