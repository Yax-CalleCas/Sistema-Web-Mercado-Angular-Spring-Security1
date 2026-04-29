

package com.cibertec.dsw1jwt.repository;

import java.util.List;

import com.cibertec.dsw1jwt.models.Deuda;
import com.cibertec.dsw1jwt.request.DeudaRequest;


public interface DeudaService {

    List<Deuda> listar();
    List<Deuda> listarPorSocio(Long id);

    Deuda crear(DeudaRequest request);

    Deuda pagar(Long id);

    void eliminar(Long id);

    void actualizarEstados();
}