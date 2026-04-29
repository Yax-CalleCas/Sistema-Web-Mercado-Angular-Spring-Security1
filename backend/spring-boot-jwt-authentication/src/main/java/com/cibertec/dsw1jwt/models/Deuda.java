
package com.cibertec.dsw1jwt.models;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Deuda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double monto;

 
    @Enumerated(EnumType.STRING)
    private EstadoDeuda estado;

    private LocalDate fechaGeneracion;

    private LocalDate fechaVencimiento;

    private String mesReferencia;
    @Column(name = "pagado")
    private Boolean pagado;

    // Getter correcto
    public Boolean getPagado() {
        return pagado;
    }

    public void setPagado(Boolean pagado) {
        this.pagado = pagado;
    }
    @ManyToOne
    @JoinColumn(name = "socio_id")
    private Socio socio;

    @ManyToOne
    @JoinColumn(name = "puesto_id")
    private Puesto puesto;

    @ManyToOne
    @JoinColumn(name = "concepto_id")
    private ConceptoCobro concepto;
}