package com.cibertec.dsw1jwt.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.cibertec.dsw1jwt.dto.SocioReporteDTO;
import com.cibertec.dsw1jwt.models.ReporteGeneral;
import com.cibertec.dsw1jwt.service.ReporteService;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reportes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ReporteController {

    private final ReporteService reportesService;

    // Unificado: Dashboard normal y con filtros
    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, Object>> getStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(reportesService.obtenerEstadisticas(inicio, fin));
    }

    @GetMapping("/socios")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<SocioReporteDTO>> getSociosReport() {
        return ResponseEntity.ok(reportesService.obtenerReporteSocios());
    }

    @PostMapping("/guardar-cierre")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ReporteGeneral> guardarCierre(Authentication authentication) {
        String adminUser = authentication.getName();
        return ResponseEntity.ok(reportesService.guardarEstadoActual(adminUser));
    }

    @GetMapping("/historial")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<ReporteGeneral>> getHistorialReportes() {
        return ResponseEntity.ok(reportesService.listarHistorial());
    }
}