package com.cibertec.dsw1jwt.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.cibertec.dsw1jwt.models.Deuda;

import java.util.List;
@Repository

public interface DeudaRepository extends JpaRepository<Deuda, Long> {

	@Query("SELECT SUM(d.monto) FROM Deuda d WHERE d.socio.id = :socioId AND d.pagado = :pagado")
	Double sumMontoBySocioIdAndPagado(Integer socioId, boolean pagado);
    //  Todas las deudas de un socio
    List<Deuda> findBySocioId(Long socioId);

    //  Deudas pendientes (no pagadas)
    List<Deuda> findByPagadoFalse();

    //  Deudas por estado (opcional si usas enum)
    List<Deuda> findByEstado(String estado);

}