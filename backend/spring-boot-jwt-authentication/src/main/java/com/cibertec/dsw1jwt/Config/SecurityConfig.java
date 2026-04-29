package com.cibertec.dsw1jwt.Config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.cibertec.dsw1jwt.Jwt.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // 🚀 IMPORTANTE: Habilita el uso de @PreAuthorize en los controladores
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            // 1. Seguridad básica
            .csrf(csrf -> csrf.disable()) 
            
            // 2. Configuración de CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) 
            
            // 3. Manejo de excepciones (JSON para Angular)
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"No autorizado\", \"message\": \"Token inválido o no proporcionado\"}");
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Prohibido\", \"message\": \"No tienes permisos suficientes\"}");
                })
            )
            
            // 4. Autorización de rutas
            .authorizeHttpRequests(auth -> auth
                // Públicas
                .requestMatchers("/auth/**", "/api/v1/auth/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                .requestMatchers("/api/puestos/**").permitAll() 

                // Administrativas (Aseguramos que cubra todos los sub-recursos)
                .requestMatchers("/api/v1/users/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN")
                .requestMatchers("/api/admin/reportes/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN")
                
                // Usuarios / Socios
                .requestMatchers("/api/pagos/**", "/api/v1/socios/**", "/api/v1/user/**")
                    .hasAnyAuthority("ADMIN", "USER", "ROLE_ADMIN", "ROLE_USER")
                
                .anyRequest().authenticated()
            )
            
            // 5. Gestión de sesión sin estado
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Origen de Angular
        config.setAllowedOrigins(List.of("http://localhost:4200")); 
        
        // Métodos: Agregamos PATCH explícitamente para evitar el error 401 en cambios de estado
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        
        // Cabeceras: Agregamos las necesarias para el intercambio de tokens
        config.setAllowedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type", 
            "Accept", 
            "X-Requested-With", 
            "Origin"
        ));
        
        config.setAllowCredentials(true);
        config.setExposedHeaders(List.of("Authorization")); 
        config.setMaxAge(3600L); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}