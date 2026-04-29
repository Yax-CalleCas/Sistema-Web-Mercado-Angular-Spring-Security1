package com.cibertec.dsw1jwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cibertec.dsw1jwt.models.ReporteGeneral;

public interface ReporteGeneralRepository extends JpaRepository<ReporteGeneral, Long> {
    // Para traer los reportes más recientes primero
    List<ReporteGeneral> findAllByOrderByFechaGeneracionDesc();
}
