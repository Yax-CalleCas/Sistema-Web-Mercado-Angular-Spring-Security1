package com.cibertec.dsw1jwt.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cibertec.dsw1jwt.models.Pago;
import com.cibertec.dsw1jwt.models.Puesto;
import com.cibertec.dsw1jwt.models.Socio;
import com.cibertec.dsw1jwt.repository.PagoRepository;
import com.cibertec.dsw1jwt.repository.PuestoRepository;
import com.cibertec.dsw1jwt.repository.SocioRepository;
import com.cibertec.dsw1jwt.request.PagoRequest;

import java.time.LocalDateTime;
import java.util.List;

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

    @Transactional
    public void aprobarPagoPorId(Long id) {
        Pago pago = pagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con ID: " + id));

        if ("APROBADO".equals(pago.getEstado())) {
            throw new RuntimeException("El pago ya se encuentra aprobado.");
        }

        // 1. Cambiar estado del pago
        pago.setEstado("APROBADO");
        pago.setFechaPago(LocalDateTime.now());
        pagoRepository.save(pago);

        // 2. Asegurar que el puesto esté marcado como OCUPADO
        Puesto puesto = pago.getPuesto();
        if (puesto != null) {
            puesto.setEstado("OCUPADO");
            puesto.setSocio(pago.getSocio());
            puestoRepository.save(puesto);
        }
        
        System.out.println("✅ Administrador aprobó el pago ID: " + id);
    }
    @Transactional 
    public Pago crearPago(PagoRequest request, String transaccionId) {
        Socio socio = socioRepository.findById(request.getSocioId())
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

        Puesto puesto = puestoRepository.findById(request.getPuestoId())
                .orElseThrow(() -> new RuntimeException("Puesto no encontrado"));

        // Bloqueo preventivo
        if ("OCUPADO".equals(puesto.getEstado())) {
            throw new RuntimeException("El puesto " + puesto.getCodigo() + " ya no está disponible.");
        }

        // Reserva temporal (Aún está pendiente de pago)
        puesto.setEstado("OCUPADO");
        puesto.setSocio(socio);
        puestoRepository.save(puesto);

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

    /**
     * Este es el método que llama el controlador automáticamente
     * cuando el usuario vuelve de Stripe con éxito.
     */
    @Transactional
    public void confirmarPagoExitoso(String transaccionId) {
        // 1. Buscar el pago por el ID de la transacción (session_id de Stripe)
        Pago pago = pagoRepository.findByTransaccionId(transaccionId)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada: " + transaccionId));

        // 2. Si ya está aprobado, evitamos doble procesamiento
        if ("APROBADO".equals(pago.getEstado())) {
            return;
        }

        // 3. Confirmar el pago
        pago.setEstado("APROBADO");
        pago.setFechaPago(LocalDateTime.now()); // Marca de tiempo exacta
        pagoRepository.save(pago);

        // 4. Confirmar el puesto (Ya estaba como OCUPADO, solo aseguramos los datos)
        Puesto puesto = pago.getPuesto();
        puesto.setEstado("OCUPADO");
        puesto.setSocio(pago.getSocio());
        puestoRepository.save(puesto);

        System.out.println("✅ Pago confirmado automáticamente para Transacción: " + transaccionId);
    }

    @Transactional
    public void actualizarEstadoManual(String transaccionId, String estado) {
        Pago pago = pagoRepository.findByTransaccionId(transaccionId)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada: " + transaccionId));

        pago.setEstado(estado.toUpperCase());
        
        // Liberar puesto si el pago falló definitivamente
        if ("RECHAZADO".equals(pago.getEstado()) || "CANCELADO".equals(pago.getEstado())) {
            Puesto p = pago.getPuesto();
            p.setEstado("DISPONIBLE");
            p.setSocio(null);
            puestoRepository.save(p);
        }
        
        pagoRepository.save(pago);
    }

    public List<Pago> listarPagosPorSocio(Long socioId) {
        return pagoRepository.findBySocioIdOrderByFechaPagoDesc(socioId);
    }
}