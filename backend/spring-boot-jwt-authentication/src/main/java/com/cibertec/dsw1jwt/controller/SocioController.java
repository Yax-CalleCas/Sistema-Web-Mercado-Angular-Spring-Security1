package com.cibertec.dsw1jwt.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.cibertec.dsw1jwt.models.Socio;
import com.cibertec.dsw1jwt.request.SocioRequest;
import com.cibertec.dsw1jwt.service.SocioService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/socios")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200") // Habilita CORS específicamente para tu front en Angular
public class SocioController {

    private final SocioService socioService;

    /**
     * Lista todos los socios registrados.
     * Acceso: Generalmente solo ROLE_ADMIN.
     */

 // Solo el Admin ve la lista completa
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')") 
    public ResponseEntity<List<Socio>> listar() {
        return ResponseEntity.ok(socioService.listar());
    }

    // VITAL: El socio debe poder ver su propio perfil
    @GetMapping("/me/{email:.+}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')") // <--- AGREGA ESTO
    public ResponseEntity<Socio> obtenerPorEmail(@PathVariable String email) {
        return ResponseEntity.ok(socioService.obtenerPorEmail(email));
    }
    /**
     * Crea un nuevo socio en el sistema.
     * @param request DTO con la información del socio.
     */
    @PostMapping
    public ResponseEntity<Socio> crear(@RequestBody SocioRequest request) {
        return ResponseEntity.ok(socioService.crear(request));
    }

    /**
     * Obtiene los datos de un socio por su ID numérico.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Socio> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(socioService.obtenerPorId(id));
    }


    /**
     * Actualiza la información de un socio existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Socio> actualizar(@PathVariable Long id, @RequestBody SocioRequest request) {
        return ResponseEntity.ok(socioService.actualizar(id, request));
    }

    /**
     * Elimina un socio del sistema.
     * Retorna 204 No Content si la operación es exitosa.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        socioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}