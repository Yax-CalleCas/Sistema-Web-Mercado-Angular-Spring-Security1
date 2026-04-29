package com.cibertec.dsw1jwt.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import com.cibertec.dsw1jwt.models.Puesto;
import com.cibertec.dsw1jwt.models.Socio;
import com.cibertec.dsw1jwt.repository.PuestoRepository;
import com.cibertec.dsw1jwt.repository.SocioRepository;
import com.cibertec.dsw1jwt.request.PuestoRequest;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PuestoService {

    private final PuestoRepository puestoRepository;
    private final SocioRepository socioRepository;

    @Transactional
    public Puesto crear(PuestoRequest req) {
        // Busqueda opcional de socio para vinculacion inicial
        Socio socio = (req.getSocioId() != null && req.getSocioId() > 0) ? 
            socioRepository.findById(req.getSocioId())
                .orElseThrow(() -> new RuntimeException("Socio con ID " + req.getSocioId() + " no existe")) : null;

        Puesto p = new Puesto();
        this.mapearDatos(p, req, socio);
        return puestoRepository.save(p);
    }
    
    @Transactional
    public Puesto actualizar(Integer id, PuestoRequest request) {
        Puesto p = puestoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Puesto no encontrado"));

        // Buscamos al socio si viene un ID en la petición
        Socio socio = (request.getSocioId() != null && request.getSocioId() > 0) ? 
            socioRepository.findById(request.getSocioId()).orElse(null) : null;

        // USAMOS EL MÉTODO PRIVADO PARA NO REPETIR CÓDIGO
        this.mapearDatos(p, request, socio);
        
        // Lógica de seguridad: si no está OCUPADO, nos aseguramos que el socio sea null
        if (!"OCUPADO".equals(request.getEstado())) {
            p.setSocio(null); 
        }

        return puestoRepository.save(p);
    }

    // Asegúrate de que mapearDatos tenga estas líneas al final (ya las tenías, pero verifica)
    private void mapearDatos(Puesto p, PuestoRequest req, Socio s) {
        p.setCodigo(req.getCodigo());
        p.setUbicacion(req.getUbicacion());
        p.setCategoria(req.getCategoria());
        p.setEstado(req.getEstado() != null ? req.getEstado() : "DISPONIBLE");
        p.setActivo(req.isActivo());
        p.setSocio(s);
        p.setEsAsociacion(req.isEsAsociacion());
        p.setImagenUrl(req.getImagenUrl());
        p.setPrecioAlquiler(req.getPrecioAlquiler());
        p.setServiciosIncluidos(req.isServiciosIncluidos());
        p.setCostoAguaFijo(req.getCostoAguaFijo());
        p.setCostoLuzFijo(req.getCostoLuzFijo());
        // ESTO ES LO QUE FALTABA EN LA ACTUALIZACIÓN:
        p.setDescripcion(req.getDescripcion());
        p.setFotosGaleria(req.getFotosGaleria());
    }

    public List<Puesto> listar() {
        return puestoRepository.findAll();
    }
    
    // Filtros para el cliente final: solo activos, sin dueño y en estado DISPONIBLE
    public List<Puesto> listarDisponibles() {
        return puestoRepository.findBySocioIsNullAndEstadoAndActivoTrue("DISPONIBLE");
    }

    public List<Puesto> listarDisponiblesNormales() {
        return puestoRepository.findBySocioIsNullAndEsAsociacionFalseAndEstado("DISPONIBLE");
    }

    public List<Puesto> listarDisponiblesAsociacion() {
        return puestoRepository.findBySocioIsNullAndEsAsociacionTrueAndEstado("DISPONIBLE");
    }

    public Puesto obtener(Integer id) {
        return puestoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Puesto no encontrado"));
    }

    @Transactional
    public void eliminar(Integer id) {
        // Se recomienda verificar si tiene pagos asociados antes de eliminar fisicamente
        puestoRepository.deleteById(id);
    }

    public Page<Puesto> listarPaginado(Pageable pageable) {
        return puestoRepository.findAll(pageable);
    }
}