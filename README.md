# TaskList
Evaluación Técnica - Márquez Barraza Jesús David

Esta es una aplicación web de lista de tareas con autenticación de usuarios.

Backend: Spring Boot (Java 17)
Frontend: React
Base de datos: MySQL (en Docker)
  -Puerto:3307
  -BD: tasklist
  -Usuario: root
  -Contraseña: jesusdavid123
Caché: Redis (en Docker)
Mensajería Asíncrona: RabbitMQ (en Docker) (aunque no se implementó completamente)
Gestión de dependencias: Gradle (para backend) y npm (para frontend)

Para que la aplicación web funcione correctamente se tienen que tener contenedores de Docker para:
-MySQL: Crear una base de datos llamada tasklist con un usuario root con contraseña jesusdavid123
-RabbitMQ
-Redis
