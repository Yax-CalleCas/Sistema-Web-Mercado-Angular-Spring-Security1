package com.irojas.demojwt.pago;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pagos")
@CrossOrigin(origins = "*")
public class PagoController {

    private final PagoService pagoService;
    private final PasarelaService pasarelaService;

    public PagoController(PagoService pagoService,
                          PasarelaService pasarelaService) {
        this.pagoService = pagoService;
        this.pasarelaService = pasarelaService;
    }

    @PostMapping("/crear-checkout")
    public ResponseEntity<?> crearCheckout(@RequestBody PagoRequest request) {

        // 1. crear sesión en pasarela
        String urlPago = pasarelaService.crearPago(request.getMonto(), request.getConcepto());

        // 2. guardar pago pendiente
        String transaccionId = pasarelaService.obtenerTransaccionId(urlPago);

        pagoService.crearPago(request, transaccionId);

        return ResponseEntity.ok(urlPago);
    }

  /*  @PostMapping("/webhook")
    public ResponseEntity<?> webhook(@RequestBody String payload) {

        // aquí la pasarela te avisa si pagó o no
        String transaccionId = pasarelaService.extraerId(payload);
        String estado = pasarelaService.verificarEstado(payload);

        pagoService.actualizarEstado(transaccionId, estado);

        return ResponseEntity.ok().build();
    }*/
}