package com.cibertec.dsw1jwt.Config;

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

import com.cibertec.dsw1jwt.Jwt.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

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
            // 1. Deshabilitar CSRF (necesario para APIs REST con JWT)
            .csrf(csrf -> csrf.disable()) 
            
            // 2. Habilitar CORS con la configuración definida abajo
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) 
            
            // 3. Manejo de errores para que Angular reciba JSON en lugar de HTML
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
            
            // 4. Configuración de Rutas (Autorizaciones)
            .authorizeHttpRequests(auth -> auth
                // RUTA PÚBLICA: Registro y Login (Permite que cualquier usuario se registre)
                .requestMatchers("/auth/**", "/api/v1/auth/**").permitAll()
                
                // Permitir peticiones OPTIONS (necesario para que el navegador valide el CORS)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                
                // Puestos es público para que los visitantes vean el catálogo
                .requestMatchers("/api/puestos/**").permitAll() 

                // RUTAS DE ADMINISTRADOR: Gestión de usuarios y reportes
                .requestMatchers("/api/v1/users/**", "/api/admin/reportes/**")
                    .hasAnyAuthority("ADMIN", "ROLE_ADMIN")
                
                // RUTAS DE SOCIO/USER: Pagos y perfil propio
                .requestMatchers("/api/pagos/**", "/api/v1/socios/**", "/api/v1/user/**")
                    .hasAnyAuthority("ADMIN", "USER", "ROLE_ADMIN", "ROLE_USER")
                
                // Cualquier otra ruta requiere estar logueado
                .anyRequest().authenticated()
            )
            
            // 5. No guardar estado de sesión (Stateless) ya que usamos JWT
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

        // Permitir el origen de tu aplicación Angular
        config.setAllowedOrigins(List.of("http://localhost:4200")); 
        
        // Métodos permitidos
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        
        // Cabeceras permitidas
        config.setAllowedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type", 
            "Accept", 
            "X-Requested-With", 
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        // Permitir credenciales (Cookies, Auth headers)
        config.setAllowCredentials(true);
        
        // Exponer la cabecera de Authorization para que Angular pueda leer el token si fuera necesario
        config.setExposedHeaders(List.of("Authorization")); 
        
        config.setMaxAge(3600L); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}