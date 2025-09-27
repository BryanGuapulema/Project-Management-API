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

### Auth

- `POST /api/auth/register` → Registra un nuevo usuario (acceso público).
- `POST /api/auth/login` → Inicia sesión, genera `accessToken` y `refreshToken` (acceso público).
- `POST /api/auth/refresh` → Genera un nuevo `accessToken` usando el `refreshToken` válido (requiere cookie con refresh).
- `POST /api/auth/logout` → Cierra la sesión eliminando el `refreshToken` (requiere autenticación).


### Users 
- `GET /api/users` → Lista todos los usuarios (**solo admin**).
- `GET /api/users/:id` → Obtiene un usuario (admin puede ver cualquiera, user solo puede ver su propio perfil).
- `POST /api/users` → Crea un usuario (registro abierto).
- `PUT /api/users/:id` → Actualiza un usuario (admin puede actualizar cualquiera, user solo su propio perfil).
- `DELETE /api/users/:id` → Elimina un usuario (admin puede eliminar cualquiera, user solo su propio perfil).

---

### Boards
- `GET /api/boards` → Lista todos los boards  
  - **admin** → devuelve todos los boards.  
  - **user** → devuelve solo los boards creados por él.
- `GET /api/boards/:id` → Obtiene un board por ID  
  - **admin** → puede acceder a cualquier board.  
  - **user** → solo si es owner del board.
- `POST /api/boards` → Crea un board (admin o user).
- `PATCH /api/boards/:id` → Actualiza un board  
  - **admin** → puede actualizar cualquier board.  
  - **user** → solo si es owner del board.
- `DELETE /api/boards/:id` → Elimina un board  
  - **admin** → puede eliminar cualquier board.  
  - **user** → solo si es owner del board.

---

### Lists
- `GET /api/lists/board/:boardId` → Lista todas las listas de un board  
  - **admin** → puede ver las listas de cualquier board.  
  - **user** → solo puede ver listas de sus boards.
- `GET /api/lists/:id` → Obtiene una lista por ID  
  - **admin** → puede ver cualquier lista.  
  - **user** → solo si pertenece a uno de sus boards.
- `POST /api/lists` → Crea una lista  
  - **admin** → en cualquier board.  
  - **user** → solo en sus propios boards.
- `PATCH /api/lists/:id` → Actualiza una lista  
  - **admin** → puede actualizar cualquier lista.  
  - **user** → solo si pertenece a uno de sus boards.
- `DELETE /api/lists/:id` → Elimina una lista  
  - **admin** → puede eliminar cualquier lista.  
  - **user** → solo si pertenece a uno de sus boards.

---

### Tasks
- `GET /api/tasks` → Lista todas las tareas  
  - **admin** → devuelve todas las tareas.  
  - **user** → devuelve solo las tareas que pertenecen a listas de sus boards.
- `GET /api/tasks/:id` → Obtiene una tarea por ID  
  - **admin** → puede ver cualquier tarea.  
  - **user** → solo si la tarea pertenece a listas de sus boards.
- `POST /api/tasks` → Crea una tarea  
  - **admin** → en cualquier lista.  
  - **user** → solo en listas de sus boards.
- `PATCH /api/tasks/:id` → Actualiza una tarea  
  - **admin** → puede actualizar cualquier tarea.  
  - **user** → solo si pertenece a listas de sus boards.
- `DELETE /api/tasks/:id` → Elimina una tarea  
  - **admin** → puede eliminar cualquier tarea.  
  - **user** → solo si pertenece a listas de sus boards.

---

## 🔑 Reglas de negocio y autorizaciones

### Autenticación
- Todos los endpoints requieren **JWT válido**.
- Si no se envía `Authorization: Bearer <token>` → `401 Unauthorized`.

### Autorización por rol
- **admin** → Puede acceder y modificar cualquier recurso (boards, lists, tasks, users).
- **user** → Solo puede acceder a:
  - Sus propios boards.
  - Lists que pertenecen a sus boards.
  - Tasks que pertenecen a sus lists.
  - Su propio perfil de usuario.

### Validaciones generales
- IDs deben ser **ObjectId válidos** → si no, `400 Bad Request`.
- Si el recurso no existe (board, list, task, user) → `404 Not Found`.
- Si el usuario no tiene acceso al recurso → `403 Forbidden`.
