package com.cibertec.dsw1jwt.pago;


import org.springframework.stereotype.Service;

import com.cibertec.dsw1jwt.puesto.Puesto;
import com.cibertec.dsw1jwt.puesto.PuestoRepository;
import com.cibertec.dsw1jwt.socio.Socio;
import com.cibertec.dsw1jwt.socio.SocioRepository;

import java.time.LocalDateTime;

@Service
public class PagoService {

    private final PagoRepository pagoRepository;
    private final SocioRepository socioRepository;
    private final PuestoRepository puestoRepository;

    public PagoService(PagoRepository pagoRepository,
                       SocioRepository socioRepository,
                       PuestoRepository puestoRepository) {
        this.pagoRepository = pagoRepository;
        this.socioRepository = socioRepository;
        this.puestoRepository = puestoRepository;
    }

    public Pago crearPago(PagoRequest request, String transaccionId) {

        Socio socio = socioRepository.findById(request.getSocioId())
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

        Puesto puesto = puestoRepository.findById(request.getPuestoId())
                .orElseThrow(() -> new RuntimeException("Puesto no encontrado"));

        Pago pago = new Pago();
        pago.setMontoTotal(request.getMonto());
        pago.setConcepto(request.getConcepto());
        pago.setFechaPago(LocalDateTime.now());
        pago.setMetodoPago("TARJETA");
        pago.setEstado("PENDIENTE");
        pago.setTransaccionId(transaccionId);
        pago.setSocio(socio);
        pago.setPuesto(puesto);

        return pagoRepository.save(pago);
    }

    public void actualizarEstado(String transaccionId, String estado) {
        Pago pago = pagoRepository.findByTransaccionId(transaccionId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        pago.setEstado(estado);
        pagoRepository.save(pago);
    }
}