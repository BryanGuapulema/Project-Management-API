# Project Management API

API para gestión de proyectos, tableros, listas y tareas, construida con **Node.js, Express y MongoDB** siguiendo el patrón MVC.

## 🚀 Tecnologías
- Node.js
- Express.js
- MongoDB + Mongoose
- Zod (validación de datos)
- JWT (autenticación, a implementar en Semana 2)

## 📂 Estructura de carpetas
- `/models` → Modelos Mongoose
- `/controllers` → Controladores
- `/routes` → Rutas de Express
- `/middlewares` → Middlewares personalizados
- `/utils` → Utilidades (errores, helpers, etc.)
- `app.js` → Configuración principal
- `index.js` → Entrada de la aplicación


## 📌 Endpoints disponibles
### Users
- `GET /api/users` → Lista todos los usuarios
- `GET /api/users/:id` → Obtiene un usuario
- `POST /api/users` → Crea un usuario
- `PUT /api/users/:id` → Actualiza un usuario
- `DELETE /api/users/:id` → Elimina un usuario

