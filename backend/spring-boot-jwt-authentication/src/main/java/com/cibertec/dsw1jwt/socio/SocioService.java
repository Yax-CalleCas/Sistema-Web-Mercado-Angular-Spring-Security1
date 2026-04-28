package com.cibertec.dsw1jwt.socio;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cibertec.dsw1jwt.User.Role;
import com.cibertec.dsw1jwt.User.User;
import com.cibertec.dsw1jwt.User.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SocioService {

    private final SocioRepository socioRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Socio crear(SocioRequest request) {

        // 🧠 VALIDACIONES BASE (evita crashes feos)
        if (request.getNombres() == null || request.getNombres().isBlank()) {
            throw new RuntimeException("Nombres obligatorios");
        }

        if (request.getDni() == null || request.getDni().isBlank()) {
            throw new RuntimeException("DNI obligatorio");
        }

        if (request.getDni().length() != 8) {
            throw new RuntimeException("DNI debe tener 8 dígitos");
        }

        // 🧼 limpieza de datos
        String nombres = request.getNombres().trim();
        String dni = request.getDni().trim();

        // 🔥 username automático seguro
        String primeraLetra = nombres.substring(0, 1).toLowerCase();
        String nuevoUsername = primeraLetra + dni + "@mppcibertec.com";

        // 🚫 validaciones de duplicados
        if (userRepository.findByUsername(nuevoUsername).isPresent()) {
            throw new RuntimeException("El usuario ya existe: " + nuevoUsername);
        }

        if (socioRepository.findByDni(dni).isPresent()) {
            throw new RuntimeException("El DNI ya está registrado: " + dni);
        }

        // 🧠 role seguro
        Role role = (request.getRole() == null) ? Role.USER : request.getRole();

        // 👤 crear user
        User user = User.builder()
                .username(nuevoUsername)
                .password(passwordEncoder.encode(
                        (request.getPassword() != null && !request.getPassword().isBlank())
                                ? request.getPassword()
                                : dni
                ))
                .role(role)
                .enabled(true)
                .build();

        userRepository.save(user);

        // 🧍 crear socio
        Socio socio = new Socio();
        socio.setNombres(nombres);
        socio.setApellidos(request.getApellidos());
        socio.setDni(dni);
        socio.setTelefono(request.getTelefono());
        socio.setDireccion(request.getDireccion());
        socio.setFotoUrl(request.getFotoUrl());
        socio.setActivo(true);
        socio.setUser(user);

        return socioRepository.save(socio);
    }

    public Socio obtenerPorId(Long id) {
        return socioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado con ID: " + id));
    }

    @Transactional
    public Socio actualizar(Long id, SocioRequest request) {

        Socio socio = socioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

        socio.setNombres(request.getNombres());
        socio.setApellidos(request.getApellidos());
        socio.setDni(request.getDni());
        socio.setTelefono(request.getTelefono());
        socio.setDireccion(request.getDireccion());
        socio.setFotoUrl(request.getFotoUrl());

        return socioRepository.save(socio);
    }

    public List<Socio> listar() {
        return socioRepository.findAll();
    }

    public Socio buscarPorUsername(String username) {
        return socioRepository.findByUser_Username(username)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));
    }

    @Transactional
    public void eliminar(Long id) {

        Socio socio = socioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

        User user = socio.getUser();

        socio.setUser(null);
        socioRepository.delete(socio);

        if (user != null) {
            userRepository.delete(user);
        }
    }
}