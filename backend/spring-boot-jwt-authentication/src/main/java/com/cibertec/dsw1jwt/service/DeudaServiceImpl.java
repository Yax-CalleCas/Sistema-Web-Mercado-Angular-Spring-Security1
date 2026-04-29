package com.cibertec.dsw1jwt.service;

import com.cibertec.dsw1jwt.models.ConceptoCobro;
import com.cibertec.dsw1jwt.models.Deuda;
import com.cibertec.dsw1jwt.models.EstadoDeuda;
import com.cibertec.dsw1jwt.models.Puesto;
import com.cibertec.dsw1jwt.models.Socio;
import com.cibertec.dsw1jwt.repository.ConceptoCobroRepository;
import com.cibertec.dsw1jwt.repository.DeudaRepository;
import com.cibertec.dsw1jwt.repository.DeudaService;
import com.cibertec.dsw1jwt.repository.PuestoRepository;
import com.cibertec.dsw1jwt.repository.SocioRepository;
import com.cibertec.dsw1jwt.request.DeudaRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DeudaServiceImpl implements DeudaService {

    private final DeudaRepository deudaRepository;
    private final SocioRepository socioRepository;
    private final PuestoRepository puestoRepository;
    private final ConceptoCobroRepository conceptoRepository;

    @Override
    public List<Deuda> listar() {
        return deudaRepository.findAll();
    }

    @Override
    public List<Deuda> listarPorSocio(Long id) {
        return deudaRepository.findBySocioId(id);
    }

    @Override
    public Deuda crear(DeudaRequest request) {

        Socio socio = socioRepository.findById(request.getSocioId())
                .orElseThrow(() -> new RuntimeException("Socio no existe"));

        // 🔥 FIX: Long → Integer
        Puesto puesto = puestoRepository.findById(request.getPuestoId().intValue())
                .orElseThrow(() -> new RuntimeException("Puesto no existe"));

        ConceptoCobro concepto = conceptoRepository.findById(request.getConceptoId())
                .orElseThrow(() -> new RuntimeException("Concepto no existe"));

        Deuda deuda = new Deuda();
        deuda.setMonto(request.getMonto());
        deuda.setPagado(false);

        // 🔥 FIX: ENUM
        deuda.setEstado(EstadoDeuda.PENDIENTE);

        deuda.setFechaGeneracion(LocalDate.now());
        deuda.setFechaVencimiento(LocalDate.parse(request.getFechaVencimiento()));
        deuda.setMesReferencia(request.getMesReferencia());

        deuda.setSocio(socio);
        deuda.setPuesto(puesto);
        deuda.setConcepto(concepto);

        return deudaRepository.save(deuda);
    }

    @Override
    public Deuda pagar(Long id) {
        Deuda deuda = deudaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Deuda no encontrada"));

        deuda.setPagado(true);

        // 🔥 FIX: ENUM
        deuda.setEstado(EstadoDeuda.PAGADO);

        return deudaRepository.save(deuda);
    }

    @Override
    public void eliminar(Long id) {
        if (!deudaRepository.existsById(id)) {
            throw new RuntimeException("Deuda no existe");
        }
        deudaRepository.deleteById(id);
    }

    @Override
    public void actualizarEstados() {

        List<Deuda> deudas = deudaRepository.findAll();
        LocalDate hoy = LocalDate.now();

        for (Deuda d : deudas) {

            if (!d.getPagado() && d.getFechaVencimiento() != null) {

                if (d.getFechaVencimiento().isBefore(hoy)) {
                    d.setEstado(EstadoDeuda.VENCIDO); // ✅ FIX
                } else {
                    d.setEstado(EstadoDeuda.PENDIENTE); // ✅ FIX
                }
            }
        }

        deudaRepository.saveAll(deudas);
    }
}