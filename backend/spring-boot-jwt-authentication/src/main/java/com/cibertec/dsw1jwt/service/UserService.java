package com.cibertec.dsw1jwt.service;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.cibertec.dsw1jwt.dto.UserDTO;
import com.cibertec.dsw1jwt.dto.UserRequestDTO;
import com.cibertec.dsw1jwt.models.Role;
import com.cibertec.dsw1jwt.models.User;
import com.cibertec.dsw1jwt.repository.UserRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Listar todos para el Admin
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

 // UserService.java
    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con username: " + username));
        return mapToDTO(user);
    }
    
    // Obtener uno por ID
    public UserDTO getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return mapToDTO(user);
    }

    @Transactional
    public UserDTO createUser(UserRequestDTO request) {
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.valueOf(request.getRole().toUpperCase()))
                .enabled(true)
                .build();
        return mapToDTO(userRepository.save(user));
    }

    @Transactional
    public UserDTO updateUser(Integer id, UserRequestDTO request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        user.setUsername(request.getUsername());
        user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        user.setEnabled(request.isEnabled());
        
        // Solo actualiza contraseña si se envía una nueva
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        return mapToDTO(userRepository.save(user));
    }

    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole().name())
                .enabled(user.isEnabled())
                .build();
    }
    
    @Transactional
    public UserDTO toggleUserStatus(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Cambia el estado al opuesto
        user.setEnabled(!user.isEnabled());
        
        return mapToDTO(userRepository.save(user));
    }
}