package com.cibertec.dsw1jwt.socio;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/socios")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200") // Permite conexión desde Angular
public class SocioController {

    private final SocioService socioService;

    @GetMapping
    public ResponseEntity<List<Socio>> listar() {
        return ResponseEntity.ok(socioService.listar());
    }

    @PostMapping
    public ResponseEntity<Socio> crear(@RequestBody SocioRequest request) {
        return ResponseEntity.ok(socioService.crear(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Socio> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(socioService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Socio> actualizar(@PathVariable Long id, @RequestBody SocioRequest request) {
        return ResponseEntity.ok(socioService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        socioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}