package com.cibertec.dsw1jwt.puesto;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/puestos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200") // Mejor que "*"
public class PuestoController {

    private final PuestoService puestoService;

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody PuestoRequest request) {
        try {
            Puesto nuevo = puestoService.crear(request);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            // Esto te ayudará a ver el error real en los logs del navegador
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<Puesto>> disponibles() {
        List<Puesto> lista = puestoService.listarDisponibles();
        return lista.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(lista);
    }
    
    @GetMapping("/disponibles/normales")
    public ResponseEntity<List<Puesto>> disponiblesNormales() {
        List<Puesto> lista = puestoService.listarDisponiblesNormales();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/disponibles/asociacion")
    public ResponseEntity<List<Puesto>> disponiblesAsociacion() {
        List<Puesto> lista = puestoService.listarDisponiblesAsociacion();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public Puesto obtener(@PathVariable Integer id) {
        return puestoService.obtener(id);
    }

    @PutMapping("/{id}")
    public Puesto actualizar(@PathVariable Integer id, @RequestBody PuestoRequest request) {
        return puestoService.actualizar(id, request);
    }

    // Mejora en el Delete para avisar que se borró
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        puestoService.eliminar(id);
        return ResponseEntity.ok().build();
    }
    

    @GetMapping("/page")
    public Page<Puesto> listarPaginado(Pageable pageable) {
        return puestoService.listarPaginado(pageable);
    }
}