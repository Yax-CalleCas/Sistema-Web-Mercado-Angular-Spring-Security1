package com.irojas.demojwt.puesto;

import com.irojas.demojwt.socio.Socio;
import com.irojas.demojwt.socio.SocioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PuestoService {

    private final PuestoRepository puestoRepository;
    private final SocioRepository socioRepository;

    @Transactional
    public Puesto crear(PuestoRequest req) {
        // Si req.getSocioId() ya es Long, lo usamos directo
        Socio socio = (req.getSocioId() != null && req.getSocioId() > 0) ? 
            socioRepository.findById(req.getSocioId()) // Quitamos .longValue() si ya es Long
                .orElseThrow(() -> new RuntimeException("Socio con ID " + req.getSocioId() + " no existe")) : null;

        Puesto p = new Puesto();
        this.mapearDatos(p, req, socio);
        return puestoRepository.save(p);
    }
    
    @Transactional
    public Puesto actualizar(Integer id, PuestoRequest req) {
        Puesto p = obtener(id);
        
        // CORRECCIÓN: Conversión a Long para el repositorio de socios
        Socio socio = (req.getSocioId() != null) ? 
            socioRepository.findById(req.getSocioId().longValue())
                .orElseThrow(() -> new RuntimeException("Socio no encontrado")) : null;

        this.mapearDatos(p, req, socio);
        return puestoRepository.save(p);
    }

    private void mapearDatos(Puesto p, PuestoRequest req, Socio socio) {
        p.setCodigo(req.getCodigo());
        p.setUbicacion(req.getUbicacion());
        p.setEsAsociacion(req.isEsAsociacion());
        p.setImagenUrl(req.getImagenUrl());
        p.setSocio(socio);
        p.setCategoria(req.getCategoria());
        
        p.setPrecioAlquiler(req.getPrecioAlquiler());
        p.setServiciosIncluidos(req.isServiciosIncluidos());
        p.setCostoAguaFijo(req.getCostoAguaFijo());
        p.setCostoLuzFijo(req.getCostoLuzFijo());
    }

    public List<Puesto> listar() {
        return puestoRepository.findAll();
        
    }
    
 // 🔥 TODOS los disponibles
    public List<Puesto> listarDisponibles() {
        return puestoRepository.findBySocioIsNull();
    }

    // 🔥 disponibles normales
    public List<Puesto> listarDisponiblesNormales() {
        return puestoRepository.findBySocioIsNullAndEsAsociacionFalse();
    }

    // 🔥 disponibles de asociación
    public List<Puesto> listarDisponiblesAsociacion() {
        return puestoRepository.findBySocioIsNullAndEsAsociacionTrue();
    }



    public Puesto obtener(Integer id) {
        return puestoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Puesto no encontrado"));
    }

    public void eliminar(Integer id) {
        puestoRepository.deleteById(id);
    }
    
    

    public Page<Puesto> listarPaginado(Pageable pageable) {
        return puestoRepository.findAll(pageable);
    }
}