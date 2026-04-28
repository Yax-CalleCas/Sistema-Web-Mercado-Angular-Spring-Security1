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
