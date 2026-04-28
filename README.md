<<<<<<< HEAD
Sistema de Gestión MPP Piura
MPP Piura es una plataforma web robusta diseñada para la administración integral de socios y alquiler de puestos comerciales. El proyecto utiliza una arquitectura moderna basada en microservicios/APIs RESTful, garantizando seguridad, escalabilidad y una experiencia de usuario fluida.

 Arquitectura y Funcionalidades
 Seguridad y Control de Acceso (JWT)
Autenticación Stateless: Implementación de JSON Web Tokens (JWT) para una gestión de sesiones segura sin estado en el servidor.

Seguridad basada en Roles: Sistema diferenciado mediante ROLE_ADMIN y ROLE_USER configurado en Spring Security.

Protección de Endpoints: Rutas protegidas mediante filtros de autenticación y políticas de CORS para comunicación segura con el frontend en Angular.
 Gestión Administrativa (Panel Admin)
Control de Usuarios: CRUD completo para la gestión de socios y personal administrativo.

Gestión de Estados: Capacidad de activar/desactivar usuarios dinámicamente mediante peticiones optimizadas.

Seguridad de Datos: Encriptación de credenciales y validación de tokens en cada petición.

 Portal del Socio (Frontend Angular)
Dashboard Personalizado: Interfaz adaptativa que muestra información relevante según el perfil del usuario logueado.

Alquiler de Puestos: Catálogo interactivo para la visualización y reserva de puestos disponibles en el mercado.

Gestión de Pagos: Módulo para la consulta de recibos y estados financieros del socio.

 Stack Tecnológico
Backend: Java 17+, Spring Boot 3.x (Spring Security, Spring Data JPA).

Seguridad: JWT (Json Web Token), Lombok, BCrypt.

Base de Datos: MySQL / PostgreSQL.

Frontend: Angular 17+, TypeScript, Bootstrap 5, SweetAlert2.

Herramientas: Maven, Git, Postman.

 Instalación (Backend)
Configurar el entorno: Asegurarse de tener instalado JDK 17 y Maven.

Base de Datos: Configurar las credenciales en src/main/resources/application.properties.

Ejecutar:

Bash
mvn spring-boot:run
 Instalación (Frontend)
Instalar dependencias:

Bash
npm install
Iniciar servidor de desarrollo:

Bash
ng serve
La aplicación estará disponible en http://localhost:4200.
=======
# jwt-auth-login app

# BACKEND:  JWT Authentication Project (Spring Boot)

This project demonstrates how to implement a JWT Authentication functionality in an Spring Boot application.

## Overview

This project showcases the implementation of a JWT Authentication feature in an Spring Boot application.

Technologies used:
  - Spring Boot 3
  - Spring Security 6
  - Java 17

# FRONTEND JWT Authentication Project (Angular)

This project demonstrates how to implement a JWT Authentication functionality in an Angular application.

## Overview

This project showcases the implementation of a login feature in an Angular application. It utilizes Angular's powerful features such as components, services, and routing to create a seamless login experience for users.

Technologies used:
  - Angular 16 
  - TypeScript 5.0.3
  - HTML 5/CSS 3

## YouTube Channel

   For a detailed step-by-step explanation of the login implementation, please visit https://youtu.be/uKaDrojacqw.
>>>>>>> b0a6499 (proyecto: Angular y springsecurity)
