package com.cibertec.dsw1jwt.service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.cibertec.dsw1jwt.dto.SocioReporteDTO;
import com.cibertec.dsw1jwt.models.ReporteGeneral;
import com.cibertec.dsw1jwt.repository.PagoRepository;
import com.cibertec.dsw1jwt.repository.PuestoRepository;
import com.cibertec.dsw1jwt.repository.ReporteGeneralRepository;
import com.cibertec.dsw1jwt.repository.ReporteRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReporteService {
    private final PagoRepository pagoRepository;
    private final PuestoRepository puestoRepository;
    private  final ReporteGeneralRepository reporteGeneralRepository;	
    // Inyectamos el ReporteRepository para usar la query optimizada
    private final ReporteRepository reporteRepository;

    public Map<String, Object> obtenerEstadisticasGlobales() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("ingresosTotales", pagoRepository.totalHistorico() != null ? pagoRepository.totalHistorico() : 0.0);

        long total = puestoRepository.count();
        long ocupados = puestoRepository.countByEstado("OCUPADO");
        stats.put("totalPuestos", total);
        stats.put("puestosOcupados", ocupados);
        stats.put("porcentajeOcupacion", total > 0 ? (double) ocupados / total * 100 : 0);

        Double agua = puestoRepository.sumCostoAguaFijoPorEstado("OCUPADO");
        Double luz = puestoRepository.sumCostoLuzFijoPorEstado("OCUPADO");
        stats.put("recaudacionServicios", (agua != null ? agua : 0.0) + (luz != null ? luz : 0.0));

        stats.put("porConcepto", pagoRepository.recaudacionPorConcepto());

        return stats;
    }
    @Transactional
    public ReporteGeneral guardarEstadoActual(String adminUser) {
        // Obtenemos los datos actuales (usando la lógica que ya tenemos)
        Map<String, Object> stats = obtenerEstadisticasGlobales();
        
        ReporteGeneral historico = new ReporteGeneral();
        historico.setFechaGeneracion(LocalDateTime.now());
        historico.setIngresosTotales((Double) stats.get("ingresosTotales"));
        historico.setPuestosOcupados((Long) stats.get("puestosOcupados"));
        historico.setTotalPuestos((Long) stats.get("totalPuestos"));
        historico.setRecaudacionServicios((Double) stats.get("recaudacionServicios"));
        historico.setGeneradoPor(adminUser);

        return reporteGeneralRepository.save(historico);
    }
   //sirve para hacer muchas cosnsultas  a la bd 
    public List<SocioReporteDTO> obtenerReporteSocios() {
        return reporteRepository.obtenerReporteGeneralSocios();
    }
    public List<ReporteGeneral> listarHistorial() {
        return reporteGeneralRepository.findAllByOrderByFechaGeneracionDesc();
    }
}