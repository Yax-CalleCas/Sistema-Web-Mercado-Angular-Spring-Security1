package com.cibertec.dsw1jwt.User;

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

}