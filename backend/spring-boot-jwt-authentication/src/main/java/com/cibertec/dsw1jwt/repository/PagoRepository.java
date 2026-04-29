package com.cibertec.dsw1jwt.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.cibertec.dsw1jwt.models.Pago;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {

    // --- MÉTODOS EXISTENTES ---
    List<Pago> findBySocioIdOrderByFechaPagoDesc(Long socioId);
    List<Pago> findByPuestoIdOrderByFechaPagoDesc(Integer puestoId);
    Optional<Pago> findByTransaccionId(String transaccionId);
    List<Pago> findByEstadoOrderByFechaPagoDesc(String estado);
    List<Pago> findBySocioIdAndEstadoOrderByFechaPagoDesc(Long socioId, String estado);

    // --- MÉTODOS DE REPORTES ---

    @Query("SELECT SUM(p.montoTotal) FROM Pago p WHERE p.estado = 'APROBADO'")
    Double totalHistorico();

    @Query("SELECT p.concepto as concepto, SUM(p.montoTotal) as total " +
           "FROM Pago p WHERE p.estado = 'APROBADO' GROUP BY p.concepto")
    List<Map<String, Object>> recaudacionPorConcepto();

  

 // Cambia Integer por Long si tu entidad Socio usa Long id
    @Query("SELECT COALESCE(SUM(p.montoTotal), 0.0) FROM Pago p WHERE p.socio.id = :socioId AND p.estado = :estado")
    Double sumMontoBySocioIdAndEstado(@Param("socioId") Long socioId, @Param("estado") String estado);
    // --- OTROS MÉTODOS DE DASHBOARD ---

    @Query("SELECT MONTH(p.fechaPago) as mes, SUM(p.montoTotal) as total " +
           "FROM Pago p WHERE p.estado = 'APROBADO' AND YEAR(p.fechaPago) = YEAR(CURRENT_DATE) " +
           "GROUP BY MONTH(p.fechaPago)")
    List<Map<String, Object>> recaudacionMensualAnual();

    @Query("SELECT COALESCE(SUM(p.montoTotal), 0.0) FROM Pago p WHERE p.socio.id = :socioId AND p.estado = 'APROBADO'")
    Double totalPagadoPorSocio(@Param("socioId") Long socioId);

    @Query("SELECT COALESCE(SUM(p.montoTotal), 0.0) FROM Pago p WHERE p.puesto.id = :puestoId AND p.estado = 'APROBADO'")
    Double totalPagadoPorPuesto(@Param("puestoId") Integer puestoId);

    boolean existsBySocioIdAndPuestoIdAndEstado(Long socioId, Integer puestoId, String estado);
}