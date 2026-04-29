package com.cibertec.dsw1jwt.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cibertec.dsw1jwt.Jwt.JwtService;
import com.cibertec.dsw1jwt.models.Role;
import com.cibertec.dsw1jwt.models.Socio;
import com.cibertec.dsw1jwt.models.User;
import com.cibertec.dsw1jwt.repository.SocioRepository;
import com.cibertec.dsw1jwt.repository.UserRepository;
import com.cibertec.dsw1jwt.request.AuthResponse;
import com.cibertec.dsw1jwt.request.LoginRequest;
import com.cibertec.dsw1jwt.request.RegisterRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final SocioRepository socioRepository;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtService.getToken(user);

        return AuthResponse.builder()
                .token(token)
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        // 1. Detectar el rol dinámicamente o asignar USER por defecto
        Role rolesito = (request.getRole() != null) ? request.getRole() : Role.USER;

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(rolesito) // <--- Ahora usa el rol que viene del JSON
                .enabled(true)
                .build();

        user = userRepository.save(user);

        // 2. Solo crear Socio si el rol NO es ADMIN
        if (rolesito != Role.ADMIN) {
            Socio socio = new Socio();
            socio.setNombres(request.getNombres());
            socio.setApellidos(request.getApellidos());
            socio.setDni(request.getDni());
            socio.setTelefono(request.getTelefono());
            socio.setDireccion(request.getDireccion());
            socio.setActivo(true);
            socio.setUser(user);

            socioRepository.save(socio);
        }

        String token = jwtService.getToken(user);

        return AuthResponse.builder()
                .token(token)
                .build();
    }
}