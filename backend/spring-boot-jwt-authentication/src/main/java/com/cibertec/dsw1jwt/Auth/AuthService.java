package com.cibertec.dsw1jwt.Auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cibertec.dsw1jwt.Jwt.JwtService;
import com.cibertec.dsw1jwt.User.Role;
import com.cibertec.dsw1jwt.User.User;
import com.cibertec.dsw1jwt.User.UserRepository;
import com.cibertec.dsw1jwt.socio.Socio;
import com.cibertec.dsw1jwt.socio.SocioRepository;

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

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .enabled(true)
                .build();

        user = userRepository.save(user);

        Socio socio = new Socio();
        socio.setNombres(request.getNombres());
        socio.setApellidos(request.getApellidos());
        socio.setDni(request.getDni());
        socio.setTelefono(request.getTelefono());
        socio.setDireccion(request.getDireccion());
        socio.setActivo(true);
        socio.setUser(user);

        socioRepository.save(socio);

        String token = jwtService.getToken(user);

        return AuthResponse.builder()
                .token(token)
                .build();
    }
}