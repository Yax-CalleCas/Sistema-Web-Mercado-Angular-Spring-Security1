package com.cibertec.dsw1jwt.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.cibertec.dsw1jwt.dto.SocioReporteDTO;
import com.cibertec.dsw1jwt.models.ReporteGeneral;
import com.cibertec.dsw1jwt.service.ReporteService;

import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reportes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ReporteController {

    private final ReporteService reportesService;

    // 1. Estadísticas en tiempo real (lo que ya tenías)
    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(reportesService.obtenerEstadisticasGlobales());
    }

    // 2. Reporte detallado de socios (lo que ya tenías)
    @GetMapping("/socios")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<SocioReporteDTO>> getSociosReport() {
        return ResponseEntity.ok(reportesService.obtenerReporteSocios());
    }

    // --- NUEVOS ENDPOINTS PARA LA TABLA GENERAL DE REPORTES ---

    // 3. Guardar el estado actual en la base de datos (Cierre de Caja/Día)
    @PostMapping("/guardar-cierre")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ReporteGeneral> guardarCierre(Authentication authentication) {
        // Tomamos el nombre del admin logueado para saber quién generó el reporte
        String adminUser = authentication.getName();
        return ResponseEntity.ok(reportesService.guardarEstadoActual(adminUser));
    }

    // 4. Listar el historial de reportes guardados
    @GetMapping("/historial")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<ReporteGeneral>> getHistorialReportes() {
        return ResponseEntity.ok(reportesService.listarHistorial());
    }
}