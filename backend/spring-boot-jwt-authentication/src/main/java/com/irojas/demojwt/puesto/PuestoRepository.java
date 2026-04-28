package com.irojas.demojwt.puesto;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PuestoRepository extends JpaRepository<Puesto, Integer> {
    // Spring automáticamente maneja la paginación aquí
    Page<Puesto> findAll(Pageable pageable);
    // Busca puestos que no tengan socio y no sean de la asociación
  
 // Busca puestos donde no hay dueño (socio_id IS NULL)
    List<Puesto> findBySocioIsNull();

    // Filtra por tipo (Normal o Asociación) y disponibilidad
    List<Puesto> findBySocioIsNullAndEsAsociacionFalse();
    List<Puesto> findBySocioIsNullAndEsAsociacionTrue();
}
