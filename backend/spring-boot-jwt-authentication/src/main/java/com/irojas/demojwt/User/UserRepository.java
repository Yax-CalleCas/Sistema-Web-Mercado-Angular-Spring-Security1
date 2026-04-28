package com.irojas.demojwt.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUsername(String username);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query("""
        UPDATE User u
        SET u.username = :username,
            u.password = :password,
            u.role = :role,
            u.enabled = :enabled
        WHERE u.id = :id
    """)
    void updateUser(
        @Param("id") Integer id,
        @Param("username") String username,
        @Param("password") String password,
        @Param("role") Role role,
        @Param("enabled") boolean enabled
    );
}