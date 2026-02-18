# Guía para el Frontend - API Mea Culpa DM

**Base URL:** `http://localhost:3000/api`

---

## 1. Autenticación

### Registro

El registro requiere que el Discord ID esté previamente autorizado en la tabla `allowed_discord_ids`. Si no está, el servidor responde con 403.

```
POST /api/auth/register
```

**Request:**
```json
{
  "discord_id": "123456789",
  "nombre": "NombreDelJugador",
  "password": "mipassword123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJI...",
  "refresh_token": "eyJhbGciOiJI..."
}
```

**Errores posibles:**
| Código | Motivo |
|--------|--------|
| 403 | Discord ID no autorizado (no está en la whitelist) |
| 409 | Discord ID ya registrado |
| 400 | Validación fallida (password < 8 chars, campos vacíos) |

---

### Login

```
POST /api/auth/login
```

**Request:**
```json
{
  "discord_id": "123456789",
  "password": "mipassword123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJI...",
  "refresh_token": "eyJhbGciOiJI..."
}
```

**Errores posibles:**
| Código | Motivo |
|--------|--------|
| 403 | Credenciales inválidas (discord_id no existe o password incorrecto) |

---

### Refresh Token

```
POST /api/auth/refresh
```

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJI..."
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJI...",
  "refresh_token": "eyJhbGciOiJI..."
}
```

---

### JWT Payload

El `access_token` contiene:
```json
{
  "sub": "discord_id_del_usuario",
  "rol": "player|dm|admin"
}
```

**Tiempo de vida:**
- Access token: 15 minutos
- Refresh token: 7 días

**Headers para rutas protegidas:**
```
Authorization: Bearer <access_token>
```

---

## 2. Roles y Permisos

| Rol | Descripción |
|-----|-------------|
| `player` | Puede unirse a expediciones y participar |
| `dm` | Puede crear/organizar expediciones + todo lo de player |
| `admin` | Acceso total al sistema |

**Rutas públicas:** Solo `/api/auth/*` (register, login, refresh)

**Rutas protegidas:** Todas las demás requieren JWT + rol `dm` o `admin`

---

## 3. Usuarios

> Requiere: JWT + rol DM/ADMIN

### Listar todos los usuarios

```
GET /api/usuarios
```

**Response:**
```json
[
  {
    "discord_id": "123456789",
    "nombre": "NombreJugador",
    "rol": "player",
    "created_at": "2025-01-01T00:00:00.000Z"
  }
]
```

### Obtener usuario por Discord ID

```
GET /api/usuarios/:discordId
```

---

## 4. Configuración

> Requiere: JWT + rol DM/ADMIN

### Tiers

```
GET /api/configuracion/tiers          → TierResponseDto[]
GET /api/configuracion/tiers/:id      → TierResponseDto
```

```json
{
  "id": 1,
  "numero": 1,
  "piso_min": 1,
  "piso_max": 5,
  "mod_armas": 0,
  "mod_armaduras": 0,
  "descripcion": "Tier 1"
}
```

### Pisos

```
GET /api/configuracion/pisos          → PisoResponseDto[]
GET /api/configuracion/pisos/:numero  → PisoResponseDto
```

```json
{
  "numero": 1,
  "tier_id": 1,
  "tier_numero": 1,
  "bonus_recompensa": 0,
  "num_habitaciones_comunes": 4
}
```

### Tipos de Habitación

```
GET /api/configuracion/tipos-habitacion       → TipoHabitacionResponseDto[]
GET /api/configuracion/tipos-habitacion/:id   → TipoHabitacionResponseDto
```

```json
{
  "id": 1,
  "nombre": "comun",
  "usa_tabla_boss": false,
  "descripcion": "Habitación común"
}
```

### Items (CRUD completo)

```
GET    /api/configuracion/items       → ItemResponseDto[]
GET    /api/configuracion/items/:id   → ItemResponseDto
POST   /api/configuracion/items       → ItemResponseDto (crear)
PUT    /api/configuracion/items/:id   → ItemResponseDto (actualizar)
DELETE /api/configuracion/items/:id   → void
```

**Crear Item:**
```json
{
  "nombre": "Espada larga",
  "tipo": "arma",
  "precio_base": 100,
  "dados_precio": null,
  "descripcion": "Una espada estándar",
  "es_base_modificable": true
}
```

**Tipos de item válidos:** `consumible`, `equipo`, `arma`, `armadura`, `material`, `otro`

---

## 5. Expediciones

> Requiere: JWT + rol DM/ADMIN

### CRUD Expediciones

```
POST   /api/expediciones       → Crear expedición
GET    /api/expediciones       → Listar todas
GET    /api/expediciones/:id   → Obtener por ID
PUT    /api/expediciones/:id   → Actualizar
DELETE /api/expediciones/:id   → Eliminar
```

**Crear:**
```json
{
  "fecha": "2025-06-15T18:00:00.000Z",
  "notas": "Expedición al piso 3"
}
```

**Actualizar:**
```json
{
  "estado": "en_curso",
  "piso_actual": 3,
  "notas": "Avanzando bien"
}
```

**Estados válidos:** `pendiente`, `en_curso`, `completada`, `cancelada`

**Response:**
```json
{
  "id": 1,
  "organizador_id": "123456789",
  "organizador_nombre": "NombreDM",
  "fecha": "2025-06-15T18:00:00.000Z",
  "estado": "pendiente",
  "piso_actual": 1,
  "notas": null,
  "created_at": "2025-06-15T00:00:00.000Z",
  "updated_at": "2025-06-15T00:00:00.000Z"
}
```

### Participaciones

```
POST   /api/expediciones/:id/participaciones                      → Agregar participante
GET    /api/expediciones/:id/participaciones                      → Listar participantes
DELETE /api/expediciones/participaciones/:participacionId          → Quitar participante
PUT    /api/expediciones/participaciones/:participacionId/oro      → Actualizar oro
PUT    /api/expediciones/participaciones/:participacionId/desactivar  → Desactivar (sale de la expedición)
PUT    /api/expediciones/participaciones/:participacionId/reactivar   → Reactivar
```

**Agregar participante:**
```json
{
  "usuario_id": "123456789",
  "nombre_personaje": "Gandalf"
}
```

**Actualizar oro:**
```json
{
  "oro": 150
}
```

**Desactivar participante:**
```json
{
  "sala_salida": 3
}
```

**Response participación:**
```json
{
  "id": 1,
  "expedicion_id": 1,
  "usuario_id": "123456789",
  "usuario_nombre": "NombreJugador",
  "nombre_personaje": "Gandalf",
  "oro_acumulado": 150,
  "activo": true,
  "sala_salida": null,
  "created_at": "2025-06-15T00:00:00.000Z"
}
```

---

## 6. Encuentros

> Requiere: JWT + rol DM/ADMIN

### Tipos de Enemigo

```
GET    /api/encuentros/tipos-enemigo                    → Todos
GET    /api/encuentros/tipos-enemigo/piso/:pisoNumero   → Por piso
GET    /api/encuentros/tipos-enemigo/:id                → Por ID
POST   /api/encuentros/tipos-enemigo                    → Crear
PUT    /api/encuentros/tipos-enemigo/:id                → Actualizar
DELETE /api/encuentros/tipos-enemigo/:id                → Eliminar
```

**Crear:**
```json
{
  "nombre": "Goblin",
  "piso_id": 1,
  "descripcion": "Enemigo débil"
}
```

### Tabla de Encuentros

```
GET    /api/encuentros/tabla                                            → Todas
GET    /api/encuentros/tabla/:id                                        → Por ID
GET    /api/encuentros/tabla/tirada/:pisoNumero/:tipoHabitacionId/:tirada  → Por tirada
POST   /api/encuentros/tabla                                            → Crear
DELETE /api/encuentros/tabla/:id                                        → Eliminar
```

**Crear:**
```json
{
  "piso_numero": 1,
  "tipo_habitacion_id": 1,
  "rango_min": 1,
  "rango_max": 5,
  "cantidad_total": 3
}
```

### Enemigos en Encuentro

```
POST   /api/encuentros/tabla/:tablaEncuentroId/enemigos   → Agregar enemigo
GET    /api/encuentros/tabla/:tablaEncuentroId/enemigos    → Listar enemigos
DELETE /api/encuentros/enemigos/:id                        → Quitar enemigo
```

**Agregar:**
```json
{
  "tabla_encuentro_id": 1,
  "tipo_enemigo_id": 1,
  "max_cantidad": 3
}
```

---

## 7. Recompensas

> Requiere: JWT + rol DM/ADMIN

### Tabla de Recompensas

```
GET    /api/recompensas/tabla       → Todas
POST   /api/recompensas/tabla       → Crear
PUT    /api/recompensas/tabla/:id   → Actualizar
DELETE /api/recompensas/tabla/:id   → Eliminar
```

**Crear:**
```json
{
  "piso_numero": 1,
  "tipo_habitacion_id": 1,
  "rango_min": 1,
  "rango_max": 3,
  "tipo_resultado": "oro",
  "dados_oro": "2d6",
  "subtabla_nombre": null,
  "descripcion": "Pocas monedas"
}
```

**Tipos de resultado:** `nada`, `oro`, `subtabla`

### Subtablas de Recompensas

Todas las subtablas tienen el mismo patrón: `GET` (listar), `POST` (crear), `DELETE` (eliminar)

| Ruta | Descripción |
|------|-------------|
| `/api/recompensas/objetos-curiosos` | Objetos curiosos (por piso + tipo habitación) |
| `/api/recompensas/items-boss` | Items de jefe (por piso) |
| `/api/recompensas/armas` | Tabla de armas base |
| `/api/recompensas/armaduras` | Tabla de armaduras base |
| `/api/recompensas/pociones` | Tabla de pociones |
| `/api/recompensas/tesoro-menor` | Tabla de tesoro menor |
| `/api/recompensas/critico` | Tabla de crítico (tirada 20) |

---

## 8. Historial

> Requiere: JWT + rol DM/ADMIN

### Habitaciones

```
GET    /api/historial/expedicion/:expedicionId   → Historial de la expedición
GET    /api/historial/habitaciones/:id           → Detalle de habitación
POST   /api/historial/habitaciones               → Crear registro
PUT    /api/historial/habitaciones/:id           → Actualizar
DELETE /api/historial/habitaciones/:id           → Eliminar
```

### Recompensas del Historial

```
GET    /api/historial/habitaciones/:habitacionId/recompensas   → Recompensas de habitación
GET    /api/historial/recompensas/:id                          → Detalle de recompensa
POST   /api/historial/recompensas                              → Crear
PUT    /api/historial/recompensas/:id                          → Actualizar
DELETE /api/historial/recompensas/:id                          → Eliminar
```

---

## 9. Gameplay (Flujo Integrado)

> Requiere: JWT + rol DM/ADMIN

Estos endpoints manejan el flujo de juego paso a paso.

### Generar Layout del Piso

```
POST /api/gameplay/generar-layout-piso
```

```json
{
  "expedicion_id": 1,
  "piso": 3,
  "incluir_bonus": true,
  "incluir_evento": false
}
```

**Response:**
```json
{
  "expedicion_id": 1,
  "piso": 3,
  "total_habitaciones": 6,
  "habitaciones": [
    {
      "id": 10,
      "orden": 1,
      "tipo_habitacion_id": 1,
      "tipo_nombre": "comun",
      "completada": false
    }
  ]
}
```

### Resolver Encuentro de Habitación

```
POST /api/gameplay/resolver-encuentro-habitacion
```

```json
{
  "historial_habitacion_id": 10,
  "tirada": 15
}
```

**Response:**
```json
{
  "piso": 3,
  "tipo_habitacion_id": 1,
  "tirada": 15,
  "cantidad_total": 4,
  "enemigos": [
    { "nombre": "Goblin", "max_cantidad": 2 },
    { "nombre": "Orco", "max_cantidad": 1 }
  ]
}
```

### Procesar Recompensas de Habitación

```
POST /api/gameplay/procesar-recompensas-habitacion
```

```json
{
  "historial_habitacion_id": 10,
  "tiradas": [
    { "tirada_d20": 18, "tirada_subtabla": 5 },
    { "tirada_d20": 7 },
    { "tirada_d20": 20, "tirada_subtabla": 12 }
  ]
}
```

### Asignar Item a Participante

```
POST /api/gameplay/asignar-item
```

```json
{
  "historial_habitacion_id": 10,
  "participacion_id": 3,
  "tirada_original": 18,
  "tirada_subtabla": 5,
  "item_id": 42,
  "modificador_tier": 1
}
```

### Repartir Oro de Habitación

```
POST /api/gameplay/repartir-oro-habitacion
```

```json
{
  "historial_habitacion_id": 10,
  "oro_total": 300
}
```

**Response:**
```json
{
  "repartos": [
    { "participacion_id": 1, "nombre_personaje": "Gandalf", "oro": 100 },
    { "participacion_id": 2, "nombre_personaje": "Aragorn", "oro": 100 },
    { "participacion_id": 3, "nombre_personaje": "Legolas", "oro": 100 }
  ]
}
```

### Completar Habitación

```
POST /api/gameplay/completar-habitacion/:id
```

### Obtener Participantes Activos

```
GET /api/gameplay/participantes-activos/:expedicionId
```

### Resumen de Expedición

```
GET /api/gameplay/resumen-expedicion/:expedicionId
```

### Liquidar Recompensas

```
POST /api/gameplay/liquidar-recompensas
```

```json
{
  "expedicion_id": 1,
  "decisiones": [
    { "recompensa_id": 5, "vendido": true, "precio_venta": 50 },
    { "recompensa_id": 6, "vendido": false }
  ]
}
```

---

## 10. Manejo de Errores

El backend devuelve errores con este formato:

```json
{
  "statusCode": 403,
  "message": "Credenciales inválidas",
  "error": "Forbidden"
}
```

| Código | Tipo | Cuándo |
|--------|------|--------|
| 400 | Bad Request | Validación de datos fallida |
| 403 | Forbidden | Credenciales inválidas, Discord ID no autorizado, token inválido |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Discord ID ya registrado |

---

## 11. Flujo Típico del Frontend

### Registro / Login
1. Pantalla de login con campos: **Discord ID** y **Password**
2. Botón de registro con campos: **Discord ID**, **Nombre** y **Password**
3. Guardar `access_token` y `refresh_token` en localStorage/sessionStorage
4. Incluir `Authorization: Bearer <access_token>` en todas las requests
5. Cuando el access token expire (401), usar el refresh token para obtener uno nuevo

### Flujo de Juego (para DM/Admin)
1. Crear expedición → `POST /api/expediciones`
2. Agregar participantes → `POST /api/expediciones/:id/participaciones`
3. Generar layout del piso → `POST /api/gameplay/generar-layout-piso`
4. Por cada habitación:
   - Resolver encuentro → `POST /api/gameplay/resolver-encuentro-habitacion`
   - Procesar recompensas → `POST /api/gameplay/procesar-recompensas-habitacion`
   - Asignar items → `POST /api/gameplay/asignar-item`
   - Repartir oro → `POST /api/gameplay/repartir-oro-habitacion`
   - Completar → `POST /api/gameplay/completar-habitacion/:id`
5. Al terminar → Liquidar recompensas y ver resumen
