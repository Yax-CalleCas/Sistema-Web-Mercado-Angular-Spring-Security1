package com.cibertec.dsw1jwt.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.cibertec.dsw1jwt.dto.SocioReporteDTO;
import com.cibertec.dsw1jwt.models.Socio;

import java.util.List;
import java.util.Map;
 	

@Repository
public interface ReporteRepository extends JpaRepository<Socio, Integer> {

    @Query("SELECT new com.cibertec.dsw1jwt.reporte.SocioReporteDTO(" + 
           "s.id, CONCAT(s.nombres, ' ', s.apellidos), s.dni, s.telefono, " +
           "(SELECT COUNT(p) FROM Puesto p WHERE p.socio.id = s.id), " +
           "(SELECT COALESCE(SUM(pa.montoTotal), 0.0) FROM Pago pa WHERE pa.socio.id = s.id AND pa.estado = 'APROBADO'), " +
           "(SELECT COALESCE(SUM(d.monto), 0.0) FROM Deuda d WHERE d.socio.id = s.id AND d.pagado = false), " +
           "CASE WHEN s.activo = true THEN 'ACTIVO' ELSE 'INACTIVO' END) " +
           "FROM Socio s")
    List<SocioReporteDTO> obtenerReporteGeneralSocios();
    
    @Query("SELECT SUM(p.montoTotal) FROM Pago p WHERE p.estado = 'APROBADO'")
    Double totalHistorico();

    @Query("SELECT p.concepto as concepto, SUM(p.montoTotal) as total FROM Pago p WHERE p.estado = 'APROBADO' GROUP BY p.concepto")
    List<Map<String, Object>> obtenerRecaudacionPorConcepto();

    @Query("SELECT SUM(p.montoTotal) FROM Pago p WHERE p.socio.id = :socioId AND p.estado = :estado")
    Double sumMontoBySocioIdAndEstado(Integer socioId, String estado);
}