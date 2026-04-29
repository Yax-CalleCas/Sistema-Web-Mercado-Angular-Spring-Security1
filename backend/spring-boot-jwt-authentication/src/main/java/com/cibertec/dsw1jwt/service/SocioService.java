package com.cibertec.dsw1jwt.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cibertec.dsw1jwt.models.Role;
import com.cibertec.dsw1jwt.models.Socio;
import com.cibertec.dsw1jwt.models.User;
import com.cibertec.dsw1jwt.repository.SocioRepository;
import com.cibertec.dsw1jwt.repository.UserRepository;
import com.cibertec.dsw1jwt.request.SocioRequest;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SocioService {

    private final SocioRepository socioRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Transactional
    public Socio crear(SocioRequest request) {

        //  VALIDACIONES BASE
        if (request.getNombres() == null || request.getNombres().isBlank()) {
            throw new RuntimeException("Nombres obligatorios");
        }

        if (request.getDni() == null || request.getDni().isBlank()) {
            throw new RuntimeException("DNI obligatorio");
        }

        if (request.getDni().length() != 8) {
            throw new RuntimeException("DNI debe tener 8 dígitos");
        }

        //  Limpieza de datos
        String nombres = request.getNombres().trim();
        String dni = request.getDni().trim();

        //  Generación de Username automático basado en el DNI
        // Esto es lo que el socio usará para loguearse (ej: p12345678@mppcibertec.com)
        String primeraLetra = nombres.substring(0, 1).toLowerCase();
        String nuevoUsername = primeraLetra + dni + "@mppcibertec.com";

        // Validaciones de duplicados en DB
        if (userRepository.findByUsername(nuevoUsername).isPresent()) {
            throw new RuntimeException("El usuario ya existe: " + nuevoUsername);
        }

        if (socioRepository.findByDni(dni).isPresent()) {
            throw new RuntimeException("El DNI ya está registrado: " + dni);
        }

        // Manejo de Roles
        Role role = (request.getRole() == null) ? Role.USER : request.getRole();

        // 👤 1. Crear Entidad User (Seguridad)
        User user = User.builder()
                .username(nuevoUsername)
                .password(passwordEncoder.encode(
                        (request.getPassword() != null && !request.getPassword().isBlank())
                                ? request.getPassword()
                                : dni // Si no manda password, el DNI es su clave por defecto
                ))
                .role(role)
                .enabled(true)
                .build();

        userRepository.save(user);

        //  2. Crear Entidad Socio (Perfil)
        Socio socio = new Socio();
        socio.setNombres(nombres);
        socio.setApellidos(request.getApellidos());
        socio.setDni(dni);
        socio.setTelefono(request.getTelefono());
        socio.setDireccion(request.getDireccion());
        socio.setFotoUrl(request.getFotoUrl());
        socio.setActivo(true);
        socio.setUser(user); // Relación ManyToOne o OneToOne

        return socioRepository.save(socio);
    }

    public Socio obtenerPorId(Long id) {
        return socioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado con ID: " + id));
    }

    /**
     * VITAL: Busca un socio por el email de su usuario.
     * Es el método que usa el controlador para /me/{email}
     */
    public Socio obtenerPorEmail(String email) {
        return socioRepository.findByUser_Username(email)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado con el email: " + email));
    }

    @Transactional
    public Socio actualizar(Long id, SocioRequest request) {
        Socio socio = socioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

        // Actualizamos los campos básicos del perfil
        socio.setNombres(request.getNombres());
        socio.setApellidos(request.getApellidos());
        socio.setDni(request.getDni());
        socio.setTelefono(request.getTelefono());
        socio.setDireccion(request.getDireccion());
        socio.setFotoUrl(request.getFotoUrl());

        // Si se envía un rol nuevo, actualizarlo también en el Usuario vinculado
        if (request.getRole() != null && socio.getUser() != null) {
            socio.getUser().setRole(request.getRole());
        }

        return socioRepository.save(socio);
    }

    public List<Socio> listar() {
        return socioRepository.findAll();
    }

    /**
     * Elimina el socio y su respectivo usuario de seguridad en cascada.
     */
    @Transactional
    public void eliminar(Long id) {
        Socio socio = socioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

        User user = socio.getUser();

        // Romper relación para evitar problemas de integridad referencial
        socio.setUser(null);
        socioRepository.delete(socio);

        // Si el usuario existe, se borra para limpiar la tabla de credenciales
        if (user != null) {
            userRepository.delete(user);
        }
    }
}