package com.cibertec.dsw1jwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cibertec.dsw1jwt.models.Socio;

import java.util.Optional;

@Repository
public interface SocioRepository extends JpaRepository<Socio, Long> {

    // 1. Esta es la forma correcta de buscar por el username del USUARIO relacionado
    Optional<Socio> findByUser_Username(String username);
    // 🔹 Validación extra (opcional)
    boolean existsById(Long id);
    // 2. Para validaciones por DNI
    Optional<Socio> findByDni(String dni);

    // 3. Verifica si ya existe un DNI
    boolean existsByDni(String dni);
    
    // 4. Verifica si el nombre de usuario ya está tomado (navegando a la relación User)
    boolean existsByUser_Username(String username);
}