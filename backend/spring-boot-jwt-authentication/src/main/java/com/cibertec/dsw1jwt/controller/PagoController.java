package com.cibertec.dsw1jwt.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.cibertec.dsw1jwt.models.Pago;
import com.cibertec.dsw1jwt.repository.PagoRepository;
import com.cibertec.dsw1jwt.request.PagoRequest;
import com.cibertec.dsw1jwt.service.PagoService;
import com.cibertec.dsw1jwt.service.PasarelaService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/pagos") // Agregamos v1 para mantener consistencia con tus otros controladores
@RequiredArgsConstructor // Esto genera el constructor automáticamente para los campos 'final'
@CrossOrigin(origins = "http://localhost:4200")
public class PagoController {

    private final PagoService pagoService;
    private final PagoRepository pagoRepository;
    private final PasarelaService pasarelaService;

    // Listar todos los pagos PENDIENTES para el Admin
    @GetMapping("/pendientes")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Pago>> listarPendientes() {
        // Buscamos directamente en el repo los que están esperando aprobación
        return ResponseEntity.ok(pagoRepository.findByEstadoOrderByFechaPagoDesc("PENDIENTE"));
    }

    // Aprobar un pago manualmente por su ID
    @PutMapping("/{id}/aprobar")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, String>> aprobarPago(@PathVariable Long id) {
        pagoService.aprobarPagoPorId(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Pago aprobado correctamente y puesto asignado.");
        return ResponseEntity.ok(response);
    }

    // Listar pagos de un socio específico (Historial personal)
    @GetMapping("/socio/{socioId}")
    public ResponseEntity<List<Pago>> listarPorSocio(@PathVariable Long socioId) {
        List<Pago> pagos = pagoService.listarPagosPorSocio(socioId);
        return ResponseEntity.ok(pagos);
    }

    // Iniciar proceso de pago con la pasarela (Stripe/PayPal/etc)
    @PostMapping("/crear-checkout")
    public ResponseEntity<?> crearCheckout(@RequestBody PagoRequest request) {
        // 1. Crear sesión en la pasarela externa
        String urlPago = pasarelaService.crearPago(request.getMonto(), request.getConcepto());

        // 2. Extraer el ID de transacción generado por la pasarela
        String transaccionId = pasarelaService.obtenerTransaccionId(urlPago);
        
        // 3. Guardar el registro en nuestra DB como PENDIENTE
        pagoService.crearPago(request, transaccionId);

        // 4. Devolvemos la URL para que Angular redireccione al usuario
        Map<String, String> response = new HashMap<>();
        response.put("url", urlPago);
        return ResponseEntity.ok(response);
    }
}