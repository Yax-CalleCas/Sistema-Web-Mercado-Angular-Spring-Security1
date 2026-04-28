package com.irojas.demojwt.Config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.irojas.demojwt.Jwt.JwtAuthenticationFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable()) // desactiva csrf para APIs REST
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // habilita CORS
            .headers(headers -> headers.frameOptions(frame -> frame.disable())) // permite H2 console si usas

            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll() // login y register libres
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // permite preflight

                
                .requestMatchers("/api/puestos/**").permitAll()
               // .requestMatchers(HttpMethod.GET, "/api/puestos/**").permitAll() // puestos públicos
                .requestMatchers("/api/v1/users/**").hasAuthority("ROLE_ADMIN") // solo admin
                .requestMatchers("/api/v1/user/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_USER") // ambos roles
                .requestMatchers("/api/v1/socios/me/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_USER") // endpoint que te fallaba

                .requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN") // rutas admin

                .anyRequest().authenticated() // todo lo demás requiere login
            )

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // sin sesiones
            )

            .authenticationProvider(authenticationProvider) // provider de auth
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) // filtro JWT
            .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:4200")); // origen Angular
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")); // métodos permitidos
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept")); // headers permitidos
        config.setAllowCredentials(true); // permite cookies/token

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // aplica a todas las rutas
        return source;
    }
}