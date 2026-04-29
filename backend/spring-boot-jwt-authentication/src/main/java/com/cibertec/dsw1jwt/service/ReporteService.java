package com.cibertec.dsw1jwt.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.cibertec.dsw1jwt.dto.SocioReporteDTO;
import com.cibertec.dsw1jwt.models.ReporteGeneral;
import com.cibertec.dsw1jwt.repository.PuestoRepository;
import com.cibertec.dsw1jwt.repository.ReporteGeneralRepository;
import com.cibertec.dsw1jwt.repository.ReporteRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final PuestoRepository puestoRepository;
    private final ReporteGeneralRepository reporteGeneralRepository;
    private final ReporteRepository reporteRepository;
    public Map<String, Object> obtenerEstadisticas(LocalDate inicio, LocalDate fin) {
        Map<String, Object> stats = new HashMap<>();

        // 1. CONVERSIÓN EXPLÍCITA A LocalDateTime 🚀
        // Inicio: 00:00:00 del día seleccionado
        LocalDateTime fechaInicio = (inicio != null) 
            ? inicio.atStartOfDay() 
            : LocalDate.of(2000, 1, 1).atStartOfDay();

        // Fin: 23:59:59 del día seleccionado
        LocalDateTime fechaFin = (fin != null) 
            ? fin.atTime(23, 59, 59) 
            : LocalDate.now().atTime(23, 59, 59);

        // 2. Ahora sí coinciden los tipos (LocalDateTime, LocalDateTime)
        Double ingresos = reporteRepository.sumIngresosPorRango(fechaInicio, fechaFin);
        stats.put("ingresosTotales", (ingresos != null) ? ingresos : 0.0);

        long total = puestoRepository.count();
        long ocupados = puestoRepository.countByEstado("OCUPADO");
        stats.put("totalPuestos", total);
        stats.put("puestosOcupados", ocupados);
        stats.put("porcentajeOcupacion", total > 0 ? (double) ocupados / total * 100 : 0);

        stats.put("porConcepto", reporteRepository.recaudacionPorConceptoYFecha(fechaInicio, fechaFin));

        Double servicios = reporteRepository.sumServiciosPorRango(fechaInicio, fechaFin);
        stats.put("recaudacionServicios", (servicios != null) ? servicios : 0.0);

        return stats;
    }
    @Transactional
    public ReporteGeneral guardarEstadoActual(String adminUser) {
        // Guardamos el cierre con los datos históricos (null, null)
        Map<String, Object> stats = obtenerEstadisticas(null, null);
        
        ReporteGeneral historico = new ReporteGeneral();
        historico.setFechaGeneracion(LocalDateTime.now());
        historico.setIngresosTotales((Double) stats.get("ingresosTotales"));
        historico.setPuestosOcupados((Long) stats.get("puestosOcupados"));
        historico.setTotalPuestos((Long) stats.get("totalPuestos"));
        historico.setRecaudacionServicios((Double) stats.get("recaudacionServicios"));
        historico.setGeneradoPor(adminUser);

        return reporteGeneralRepository.save(historico);
    }

    public List<SocioReporteDTO> obtenerReporteSocios() {
        return reporteRepository.obtenerReporteGeneralSocios();
    }

    public List<ReporteGeneral> listarHistorial() {
        return reporteGeneralRepository.findAllByOrderByFechaGeneracionDesc();
    }
}