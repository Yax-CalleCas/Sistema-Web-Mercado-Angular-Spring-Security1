package com.irojas.demojwt.deuda;

import com.irojas.demojwt.puesto.ConceptoCobro;
import com.irojas.demojwt.puesto.Puesto;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "deuda")
public class Deuda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Double monto;
    private boolean pagado = false;
    
    private String fechaGeneracion; // Sugerencia: Usar LocalDate en el futuro
    private String mesReferencia;   // Ejemplo: "Mayo 2026"

    @ManyToOne
    @JoinColumn(name = "puesto_id")
    private Puesto puesto;

    @ManyToOne
    @JoinColumn(name = "concepto_id")
    private ConceptoCobro concepto;
}