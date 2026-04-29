package com.cibertec.dsw1jwt.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.cibertec.dsw1jwt.models.Deuda;
import com.cibertec.dsw1jwt.repository.DeudaService;
import com.cibertec.dsw1jwt.request.DeudaRequest;
import java.util.List;

@RestController
@RequestMapping("/api/deudas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DeudaController {

    private final DeudaService deudaService;

    @GetMapping
    public List<Deuda> listar() {
        return deudaService.listar();
    }

    @GetMapping("/socio/{id}")
    public List<Deuda> porSocio(@PathVariable Long id) {
        return deudaService.listarPorSocio(id);
    }

    @PostMapping
    public Deuda crear(@RequestBody DeudaRequest request) {
        return deudaService.crear(request);
    }

    @PutMapping("/{id}/pagar")
    public Deuda pagar(@PathVariable Long id) {
        return deudaService.pagar(id);
    }

    @PutMapping("/actualizar-estados")
    public void actualizar() {
        deudaService.actualizarEstados();
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        deudaService.eliminar(id);
    }
}