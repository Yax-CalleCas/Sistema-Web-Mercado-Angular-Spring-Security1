package com.cibertec.dsw1jwt.Jwt;

import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;

import org.springframework.util.StringUtils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Obtener el token del header
        final String token = getTokenFromRequest(request);
        final String username;

        // 2. Si no hay token, pasamos al siguiente filtro (SecurityConfig decidirá si la ruta es pública o no)
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            username = jwtService.getUsernameFromToken(token);

            // 3. Si el token tiene usuario y no hay autenticación activa en el contexto
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // 4. Validar si el token sigue siendo íntegro y no ha expirado
                if (jwtService.isTokenValid(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // 🚀 CLAVE: Establecemos la autenticación en el contexto global de Spring
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
         // Dentro de doFilterInternal en JwtAuthenticationFilter.java
        } catch (ExpiredJwtException e) {
            System.err.println("Token expirado: " + e.getMessage());
            // Opcional: Podrías enviar un error 401 directamente aquí si quisieras
            filterChain.doFilter(request, response);
            return;
        } catch (Exception e) {
            System.err.println("Fallo en la autenticación JWT: " + e.getMessage());
        }
        filterChain.doFilter(request, response);
    }

    // Método auxiliar limpio para extraer el Bearer
    private String getTokenFromRequest(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");

        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}