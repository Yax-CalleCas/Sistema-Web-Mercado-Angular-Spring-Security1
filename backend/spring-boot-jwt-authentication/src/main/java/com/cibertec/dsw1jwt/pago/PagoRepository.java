package com.cibertec.dsw1jwt.pago;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PagoRepository extends JpaRepository<Pago, Long> {

    // 📌 Pagos de un socio (historial del usuario)
    List<Pago> findBySocioIdOrderByFechaPagoDesc(Long socioId);

    // 📌 Pagos por puesto (útil admin / auditoría)
    List<Pago> findByPuestoIdOrderByFechaPagoDesc(Integer puestoId);

    // 🔥 CLAVE: buscar por transacción (webhook de pasarela)
    Optional<Pago> findByTransaccionId(String transaccionId);

    // 📊 filtros por estado (PENDIENTE, APROBADO, RECHAZADO)
    List<Pago> findByEstadoOrderByFechaPagoDesc(String estado);

    // 📆 pagos por socio + estado (ej: solo aprobados del usuario)
    List<Pago> findBySocioIdAndEstadoOrderByFechaPagoDesc(Long socioId, String estado);

    // 💡 dashboard: total pagado por socio
    @Query("SELECT SUM(p.montoTotal) FROM Pago p WHERE p.socio.id = :socioId AND p.estado = 'APROBADO'")
    Double totalPagadoPorSocio(Long socioId);

    // 💡 dashboard: total por puesto
    @Query("SELECT SUM(p.montoTotal) FROM Pago p WHERE p.puesto.id = :puestoId AND p.estado = 'APROBADO'")
    Double totalPagadoPorPuesto(Integer puestoId);
}