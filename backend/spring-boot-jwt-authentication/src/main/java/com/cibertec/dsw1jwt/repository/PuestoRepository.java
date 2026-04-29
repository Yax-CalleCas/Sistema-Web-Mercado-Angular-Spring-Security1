package com.cibertec.dsw1jwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cibertec.dsw1jwt.models.Puesto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface PuestoRepository extends JpaRepository<Puesto, Integer> {

    // --- TUS MÉTODOS DE GESTIÓN (Mantenlos) ---
	long countBySocioId(Integer socioId);
    Page<Puesto> findAll(Pageable pageable);
    List<Puesto> findBySocioId(Long socioId);
    List<Puesto> findBySocioIsNullAndEstadoAndActivoTrue(String estado);
    List<Puesto> findBySocioIsNullAndEsAsociacionFalseAndEstado(String estado);
    List<Puesto> findBySocioIsNullAndEsAsociacionTrueAndEstado(String estado);
    boolean existsByCodigo(String codigo);

    // --- MÉTODOS PARA REPORTES (Agrégalos para que el Service no falle) ---

    // Cuenta cuántos puestos hay según su estado (EJ: OCUPADO, DISPONIBLE)
    long countByEstado(String estado);

    // Suma del costo de agua de los puestos ocupados
    @Query("SELECT COALESCE(SUM(p.costoAguaFijo), 0.0) FROM Puesto p WHERE p.estado = :estado")
    Double sumCostoAguaFijoPorEstado(@Param("estado") String estado);

    // Suma del costo de luz de los puestos ocupados
    @Query("SELECT COALESCE(SUM(p.costoLuzFijo), 0.0) FROM Puesto p WHERE p.estado = :estado")
    Double sumCostoLuzFijoPorEstado(@Param("estado") String estado);
}