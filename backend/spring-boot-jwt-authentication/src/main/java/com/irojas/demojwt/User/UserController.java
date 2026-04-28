package com.irojas.demojwt.User;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    private final UserService userService;

    // Listar todos los usuarios
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<UserDTO>> getAll() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Obtener un usuario por ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<UserDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // Crear nuevo usuario
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<UserDTO> create(@RequestBody UserRequestDTO request) {
        return ResponseEntity.ok(userService.createUser(request));
    }

    // Actualización completa de usuario
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<UserDTO> update(@PathVariable Integer id, @RequestBody UserRequestDTO request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    // DESACTIVAR USUARIO (Manejo de PATCH)
    // Asegúrate que en Angular llames a: /api/v1/users/desactivar/{id}
 // Cambia esto de @PatchMapping a @PutMapping
    @PutMapping("/desactivar/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<UserDTO> desactivarUsuario(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.toggleUserStatus(id));
    }
    
    // Cambio de estado genérico (Alternativa por si usas este endpoint en Angular)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<UserDTO> toggleStatus(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.toggleUserStatus(id));
    }

    // Eliminar usuario
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}