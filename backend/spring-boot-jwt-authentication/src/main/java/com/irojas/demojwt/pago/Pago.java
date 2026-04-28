package com.irojas.demojwt.pago;

import com.irojas.demojwt.puesto.Puesto;
import com.irojas.demojwt.socio.Socio;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "pagos")
public class Pago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double montoTotal;
    private String concepto;
    private LocalDateTime fechaPago;
    private String metodoPago; // "TARJETA_VISA", "TARJETA_MASTERCARD"
    
    // 🔥 IMPORTANTE: Para rastrear el pago en la pasarela
    private String transaccionId; 
    private String estado; // "APROBADO", "RECHAZADO"

    @ManyToOne
    @JoinColumn(name = "socio_id")
    private Socio socio;

    @ManyToOne
    @JoinColumn(name = "puesto_id")
    private Puesto puesto;
}