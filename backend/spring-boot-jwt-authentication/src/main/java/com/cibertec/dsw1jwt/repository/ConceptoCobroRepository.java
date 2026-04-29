package com.cibertec.dsw1jwt.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cibertec.dsw1jwt.models.ConceptoCobro;


@Repository
public interface ConceptoCobroRepository extends JpaRepository<ConceptoCobro, Long> {

    boolean existsById(Long id);
    
}