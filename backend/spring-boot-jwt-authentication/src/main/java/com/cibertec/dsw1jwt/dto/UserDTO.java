package com.cibertec.dsw1jwt.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Integer id;
    private String username;
    private String role;
    private boolean enabled;
    private String nombres;
    private String apellidos;

}