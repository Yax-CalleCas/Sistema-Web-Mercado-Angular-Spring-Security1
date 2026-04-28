package com.cibertec.dsw1jwt.deuda;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.cibertec.dsw1jwt.puesto.ConceptoCobro;
import com.cibertec.dsw1jwt.puesto.Puesto;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeudaService {

    private final DeudaRepository deudaRepository;

    public void crearMasivo(List<Puesto> puestos, ConceptoCobro concepto, double monto) {

        for (Puesto p : puestos) {
            Deuda d = new Deuda();
            d.setPuesto(p);
            d.setConcepto(concepto);
            d.setMonto(monto);
            d.setPagado(false);
            d.setFechaGeneracion(java.time.LocalDate.now().toString());

            deudaRepository.save(d);
        }
    }
}