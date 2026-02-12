# Mea Culpa DM - Documentación API para Frontend

> Base URL: `http://localhost:3000/api`
> Todas las rutas (excepto Auth) requieren header: `Authorization: Bearer <token>`
> Roles permitidos: `dm` y `admin`

---

## Tabla de Contenidos

1. [Autenticación](#1-autenticación)
2. [Flujo Completo de una Expedición](#2-flujo-completo-de-una-expedición)
3. [Configuración (tablas base)](#3-configuración)
4. [Usuarios](#4-usuarios)
5. [Expediciones y Participaciones](#5-expediciones-y-participaciones)
6. [Encuentros (cargar tablas)](#6-encuentros)
7. [Recompensas (cargar tablas)](#7-recompensas)
8. [Gameplay (resolver tiradas)](#8-gameplay)
9. [Historial](#9-historial)
10. [Enums y Valores](#10-enums-y-valores)

---

## 1. Autenticación

### Registrar usuario

```
POST /api/auth/register
```

```json
{
  "discord_id": "123456789012345678",
  "nombre": "Juan Perez",
  "email": "juan@mail.com",
  "password": "miPassword123"
}
```

**Response 201:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Login

```
POST /api/auth/login
```

```json
{
  "email": "juan@mail.com",
  "password": "miPassword123"
}
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Refresh Token

```
POST /api/auth/refresh
```

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

> **Nota:** A partir de aquí, todos los endpoints requieren el header:
> ```
> Authorization: Bearer <access_token>
> ```

---

## 2. Flujo Completo de una Expedición (Integrado)

Este es el flujo recomendado usando los endpoints integrados que automatizan la gestión de salas, participantes activos, y recompensas.

### Paso 1: Crear la expedición

```
POST /api/expediciones
```

```json
{
  "fecha": "2026-02-15",
  "notas": "Expedición al piso 3"
}
```

### Paso 2: Agregar los 5 participantes

```
POST /api/expediciones/1/participaciones
```

Repetir para cada jugador:

```json
{ "usuario_id": "111111111111111111", "nombre_personaje": "Aldric el Guerrero" }
```
```json
{ "usuario_id": "222222222222222222", "nombre_personaje": "Lyra la Maga" }
```
```json
{ "usuario_id": "333333333333333333", "nombre_personaje": "Theron el Pícaro" }
```
```json
{ "usuario_id": "444444444444444444", "nombre_personaje": "Sera la Clériga" }
```
```json
{ "usuario_id": "555555555555555555", "nombre_personaje": "Kael el Ranger" }
```

**Response 201 (cada uno):**
```json
{
  "id": 1,
  "expedicion_id": 1,
  "usuario_id": "111111111111111111",
  "usuario_nombre": "Player1",
  "nombre_personaje": "Aldric el Guerrero",
  "oro_acumulado": 0,
  "activo": true,
  "sala_salida": null,
  "created_at": "2026-02-12T15:01:00.000Z"
}
```

### Paso 3: Arrancar la expedición

```
PUT /api/expediciones/1
```

```json
{ "estado": "en_curso" }
```

### Paso 4: Generar layout del piso

El sistema genera automáticamente las salas: N comunes + bonus (opcional) + evento (opcional) + jefe (siempre).

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

**Response 200:**
```json
{
  "expedicion_id": 1,
  "piso": 3,
  "total_habitaciones": 5,
  "habitaciones": [
    { "id": 1, "orden": 1, "tipo_habitacion_id": 1, "tipo_nombre": "comun", "completada": false },
    { "id": 2, "orden": 2, "tipo_habitacion_id": 1, "tipo_nombre": "comun", "completada": false },
    { "id": 3, "orden": 3, "tipo_habitacion_id": 1, "tipo_nombre": "comun", "completada": false },
    { "id": 4, "orden": 4, "tipo_habitacion_id": 2, "tipo_nombre": "bonus", "completada": false },
    { "id": 5, "orden": 5, "tipo_habitacion_id": 3, "tipo_nombre": "jefe", "completada": false }
  ]
}
```

> El piso 3 tiene `num_habitaciones_comunes = 3`. Se generan 3 comunes + 1 bonus + 1 jefe = 5 salas.
> `piso_actual` se actualiza automáticamente.

### Paso 5: POR CADA SALA - Resolver encuentro

El DM tira 1d20 para determinar qué enemigos aparecen en la sala:

```
POST /api/gameplay/resolver-encuentro-habitacion
```

```json
{
  "historial_habitacion_id": 1,
  "tirada": 14
}
```

**Response 200:**
```json
{
  "piso": 3,
  "tipo_habitacion_id": 1,
  "tirada": 14,
  "cantidad_total": 4,
  "enemigos": [
    { "nombre": "Esqueleto", "max_cantidad": 2 },
    { "nombre": "Zombie", "max_cantidad": 2 }
  ]
}
```

> Persiste automáticamente `tirada_encuentro` y `enemigos_derrotados` en el historial de la habitación.

### Paso 6: POR CADA SALA - Procesar recompensas (preview)

El DM tira 1d20 por cada enemigo derrotado. El sistema resuelve cada tirada contra las tablas de recompensas:

```
POST /api/gameplay/procesar-recompensas-habitacion
```

```json
{
  "historial_habitacion_id": 1,
  "tiradas": [
    { "tirada_d20": 14, "tirada_subtabla": 7 },
    { "tirada_d20": 8 },
    { "tirada_d20": 18, "tirada_subtabla": 3 },
    { "tirada_d20": 2 }
  ]
}
```

**Response 200:**
```json
{
  "historial_habitacion_id": 1,
  "piso": 3,
  "tipo_habitacion_id": 1,
  "resultados": [
    {
      "tirada_original": 14,
      "bonus_recompensa": 4,
      "tirada_con_bonus": 18,
      "tipo_resultado": "subtabla",
      "subtabla_nombre": "armas",
      "tirada_subtabla": 7,
      "requiere_subtabla": false,
      "item_nombre": "Espada larga",
      "item_id": 5,
      "modificador_tier": 0
    },
    {
      "tirada_original": 8,
      "bonus_recompensa": 4,
      "tirada_con_bonus": 12,
      "tipo_resultado": "oro",
      "dados_oro": "2d6",
      "requiere_subtabla": false
    },
    {
      "tirada_original": 18,
      "bonus_recompensa": 4,
      "tirada_con_bonus": 22,
      "tipo_resultado": "subtabla",
      "subtabla_nombre": "armaduras",
      "tirada_subtabla": 3,
      "requiere_subtabla": false,
      "item_nombre": "Escudo de roble",
      "item_id": 10,
      "modificador_tier": 0
    },
    {
      "tirada_original": 2,
      "bonus_recompensa": 4,
      "tirada_con_bonus": 6,
      "tipo_resultado": "nada",
      "requiere_subtabla": false
    }
  ],
  "items_pendientes": [
    {
      "indice": 0,
      "tirada_d20": 14,
      "tirada_subtabla": 7,
      "subtabla_nombre": "armas",
      "item_id": 5,
      "item_nombre": "Espada larga",
      "modificador_tier": 0
    },
    {
      "indice": 2,
      "tirada_d20": 18,
      "tirada_subtabla": 3,
      "subtabla_nombre": "armaduras",
      "item_id": 10,
      "item_nombre": "Escudo de roble",
      "modificador_tier": 0
    }
  ],
  "oro_dados": ["2d6"]
}
```

> **Importante:** Este endpoint es un PREVIEW. No persiste nada. Los items se asignan con `asignar-item` y el oro con `repartir-oro-habitacion`.
> `items_pendientes` lista los items que el DM debe asignar manualmente a un jugador.
> `oro_dados` lista los dados que el DM debe tirar para obtener el oro total a repartir.

### Paso 7: POR CADA SALA - Asignar items a jugadores (manual)

El DM decide qué jugador se queda con cada item:

```
POST /api/gameplay/asignar-item
```

```json
{
  "historial_habitacion_id": 1,
  "participacion_id": 1,
  "tirada_original": 14,
  "tirada_subtabla": 7,
  "item_id": 5,
  "modificador_tier": 0
}
```

**Response 200:**
```json
{
  "id": 1,
  "historial_habitacion_id": 1,
  "participacion_id": 1,
  "item_id": 5
}
```

> Repetir por cada item de `items_pendientes`.

### Paso 8: POR CADA SALA - Repartir oro entre activos (automático)

El DM tira los dados de oro (ej: 2d6 = 9) y el sistema reparte automáticamente entre los participantes activos:

```
POST /api/gameplay/repartir-oro-habitacion
```

```json
{
  "historial_habitacion_id": 1,
  "oro_total": 9
}
```

**Response 200:**
```json
{
  "repartos": [
    { "participacion_id": 1, "nombre_personaje": "Aldric el Guerrero", "oro": 2 },
    { "participacion_id": 2, "nombre_personaje": "Lyra la Maga", "oro": 2 },
    { "participacion_id": 3, "nombre_personaje": "Theron el Pícaro", "oro": 2 },
    { "participacion_id": 4, "nombre_personaje": "Sera la Clériga", "oro": 2 },
    { "participacion_id": 5, "nombre_personaje": "Kael el Ranger", "oro": 1 }
  ]
}
```

> Obtiene automáticamente los participantes ACTIVOS de la expedición.
> El sobrante se reparte 1 extra a los primeros.

### Paso 9: POR CADA SALA - Completar la sala

```
POST /api/gameplay/completar-habitacion/1
```

**Response 200:**
```json
{ "id": 1, "completada": true }
```

### Paso 9b: Si un jugador se va de la expedición

```
PUT /api/expediciones/participaciones/3/desactivar
```

```json
{ "sala_salida": 2 }
```

**Response 200:**
```json
{ "participacion_id": 3, "activo": false, "sala_salida": 2 }
```

> A partir de la siguiente sala, Theron ya no recibe oro ni participa en el reparto.
> Si el DM se equivocó, puede reactivar:

```
PUT /api/expediciones/participaciones/3/reactivar
```

**Response 200:**
```json
{ "participacion_id": 3, "activo": true }
```

### Paso 9c: Si entra un reemplazante

```
POST /api/expediciones/1/participaciones
```

```json
{ "usuario_id": "666666666666666666", "nombre_personaje": "Vex el Brujo" }
```

> El nuevo jugador entra como activo por defecto y empieza a recibir oro desde la próxima sala.

### Paso 10: Ver participantes activos

```
GET /api/gameplay/participantes-activos/1
```

**Response 200:**
```json
[
  { "id": 1, "nombre_personaje": "Aldric el Guerrero", "activo": true, "sala_salida": null, "oro_acumulado": 4 },
  { "id": 2, "nombre_personaje": "Lyra la Maga", "activo": true, "sala_salida": null, "oro_acumulado": 4 },
  { "id": 4, "nombre_personaje": "Sera la Clériga", "activo": true, "sala_salida": null, "oro_acumulado": 4 },
  { "id": 5, "nombre_personaje": "Kael el Ranger", "activo": true, "sala_salida": null, "oro_acumulado": 3 },
  { "id": 6, "nombre_personaje": "Vex el Brujo", "activo": true, "sala_salida": null, "oro_acumulado": 0 }
]
```

### Paso 11: Ver resumen completo

```
GET /api/gameplay/resumen-expedicion/1
```

> Muestra todos los items y oro por cada personaje (incluyendo inactivos).

### Paso 12: Liquidar recompensas

```
POST /api/gameplay/liquidar-recompensas
```

```json
{
  "expedicion_id": 1,
  "decisiones": [
    { "recompensa_id": 1, "vendido": false },
    { "recompensa_id": 3, "vendido": true, "precio_venta": 25 }
  ]
}
```

> Calcula oro final = oro bruto + ventas. Actualiza `oro_acumulado` automáticamente.

### Paso 13: Completar la expedición

```
PUT /api/expediciones/1
```

```json
{ "estado": "completada" }
```

---

## 3. Configuración

### Tiers

```
GET /api/configuracion/tiers
```

**Response 200:**
```json
[
  { "id": 1, "numero": 1, "piso_min": 1, "piso_max": 5, "mod_armas": 0, "mod_armaduras": 0, "descripcion": null },
  { "id": 2, "numero": 2, "piso_min": 6, "piso_max": 10, "mod_armas": 1, "mod_armaduras": 1, "descripcion": null },
  { "id": 3, "numero": 3, "piso_min": 11, "piso_max": 15, "mod_armas": 2, "mod_armaduras": 2, "descripcion": null },
  { "id": 4, "numero": 4, "piso_min": 16, "piso_max": 20, "mod_armas": 3, "mod_armaduras": 3, "descripcion": null }
]
```

```
GET /api/configuracion/tiers/:id
```

### Pisos

```
GET /api/configuracion/pisos
```

**Response 200:**
```json
[
  { "numero": 1, "tier_id": 1, "tier_numero": 1, "bonus_recompensa": 0, "num_habitaciones_comunes": 3 },
  { "numero": 2, "tier_id": 1, "tier_numero": 1, "bonus_recompensa": 2, "num_habitaciones_comunes": 3 },
  { "numero": 3, "tier_id": 1, "tier_numero": 1, "bonus_recompensa": 4, "num_habitaciones_comunes": 3 },
  { "numero": 4, "tier_id": 1, "tier_numero": 1, "bonus_recompensa": 6, "num_habitaciones_comunes": 3 },
  { "numero": 5, "tier_id": 1, "tier_numero": 1, "bonus_recompensa": 8, "num_habitaciones_comunes": 3 },
  { "numero": 6, "tier_id": 2, "tier_numero": 2, "bonus_recompensa": 0, "num_habitaciones_comunes": 3 }
]
```

> Patrón bonus: 0, 2, 4, 6, 8 — se reinicia en cada tier.

```
GET /api/configuracion/pisos/:numero
```

### Tipos de Habitación

```
GET /api/configuracion/tipos-habitacion
```

**Response 200:**
```json
[
  { "id": 1, "nombre": "comun", "usa_tabla_boss": false, "descripcion": "Habitación común" },
  { "id": 2, "nombre": "bonus", "usa_tabla_boss": false, "descripcion": "Habitación bonus" },
  { "id": 3, "nombre": "jefe", "usa_tabla_boss": true, "descripcion": "Habitación del jefe" },
  { "id": 4, "nombre": "evento", "usa_tabla_boss": false, "descripcion": "Evento especial" }
]
```

```
GET /api/configuracion/tipos-habitacion/:id
```

### Items (CRUD)

```
GET /api/configuracion/items
GET /api/configuracion/items/:id
```

```
POST /api/configuracion/items
```

```json
{
  "nombre": "Espada larga",
  "tipo": "arma",
  "precio_base": 15,
  "dados_precio": "1d6+10",
  "es_base_modificable": true
}
```

```
PUT /api/configuracion/items/:id
```

```json
{
  "precio_base": 20
}
```

```
DELETE /api/configuracion/items/:id
```

---

## 4. Usuarios

```
GET /api/usuarios
```

**Response 200:**
```json
[
  {
    "discord_id": "123456789012345678",
    "nombre": "Juan Perez",
    "email": "juan@mail.com",
    "rol": "dm",
    "created_at": "2026-02-12T14:00:00.000Z"
  }
]
```

```
GET /api/usuarios/:discordId
```

---

## 5. Expediciones y Participaciones

### CRUD Expediciones

```
GET    /api/expediciones            → Lista todas
GET    /api/expediciones/:id        → Detalle
POST   /api/expediciones            → Crear
PUT    /api/expediciones/:id        → Actualizar
DELETE /api/expediciones/:id        → Eliminar
```

**Crear:**
```json
{
  "fecha": "2026-02-15",
  "notas": "Opcional"
}
```

**Actualizar:**
```json
{
  "estado": "en_curso",
  "piso_actual": 5,
  "notas": "Cambiando de piso"
}
```

> `estado` valores posibles: `pendiente`, `en_curso`, `completada`, `cancelada`

### Participaciones

```
GET    /api/expediciones/:id/participaciones                               → Listar participantes
POST   /api/expediciones/:id/participaciones                               → Agregar participante
DELETE /api/expediciones/participaciones/:participacionId                   → Quitar participante
PUT    /api/expediciones/participaciones/:participacionId/oro              → Actualizar oro
PUT    /api/expediciones/participaciones/:participacionId/desactivar      → Jugador se va
PUT    /api/expediciones/participaciones/:participacionId/reactivar       → Revertir salida
```

**Agregar:**
```json
{
  "usuario_id": "123456789012345678",
  "nombre_personaje": "Aldric el Guerrero"
}
```

**Actualizar oro:**
```json
{ "oro": 50 }
```

**Desactivar (jugador se va):**
```json
{ "sala_salida": 3 }
```

**Reactivar (DM se equivocó):**
No requiere body.

---

## 6. Encuentros

### Tipos de Enemigo

```
GET    /api/encuentros/tipos-enemigo                    → Todos
GET    /api/encuentros/tipos-enemigo/:id                → Por ID
GET    /api/encuentros/tipos-enemigo/piso/:pisoNumero   → Por piso
POST   /api/encuentros/tipos-enemigo                    → Crear
PUT    /api/encuentros/tipos-enemigo/:id                → Actualizar
DELETE /api/encuentros/tipos-enemigo/:id                → Eliminar
```

**Crear tipo enemigo:**
```json
{
  "nombre": "Esqueleto",
  "piso_id": 3,
  "descripcion": "Enemigo no-muerto básico"
}
```

### Tabla de Encuentros

```
GET    /api/encuentros/tabla                                                   → Todas las entradas
GET    /api/encuentros/tabla/:id                                               → Por ID
GET    /api/encuentros/tabla/tirada/:pisoNumero/:tipoHabitacionId/:tirada      → Buscar por tirada
POST   /api/encuentros/tabla                                                   → Crear entrada
DELETE /api/encuentros/tabla/:id                                               → Eliminar
```

**Crear entrada en tabla encuentros:**
```json
{
  "piso_numero": 3,
  "tipo_habitacion_id": 1,
  "rango_min": 11,
  "rango_max": 15,
  "cantidad_total": 4
}
```

> Esto significa: en piso 3, habitación común, si la tirada cae entre 11-15, aparecen 4 enemigos.

### Asignar enemigos a una entrada de la tabla

```
POST   /api/encuentros/tabla/:tablaEncuentroId/enemigos   → Agregar enemigo
GET    /api/encuentros/tabla/:tablaEncuentroId/enemigos    → Ver enemigos
DELETE /api/encuentros/enemigos/:id                        → Quitar enemigo
```

**Agregar enemigo a entrada:**
```json
{
  "tabla_encuentro_id": 1,
  "tipo_enemigo_id": 1,
  "max_cantidad": 2
}
```

> La suma de max_cantidad de todos los enemigos debería coincidir con cantidad_total.

---

## 7. Recompensas

### Tabla Principal de Recompensas

```
GET    /api/recompensas/tabla       → Todas
POST   /api/recompensas/tabla       → Crear
PUT    /api/recompensas/tabla/:id   → Actualizar
DELETE /api/recompensas/tabla/:id   → Eliminar
```

**Crear entrada (resultado "nada"):**
```json
{
  "piso_numero": 3,
  "tipo_habitacion_id": 1,
  "rango_min": 1,
  "rango_max": 6,
  "tipo_resultado": "nada",
  "descripcion": "No se encuentra nada"
}
```

**Crear entrada (resultado "oro"):**
```json
{
  "piso_numero": 3,
  "tipo_habitacion_id": 1,
  "rango_min": 7,
  "rango_max": 12,
  "tipo_resultado": "oro",
  "dados_oro": "2d6",
  "descripcion": "Bolsa de monedas"
}
```

**Crear entrada (resultado "subtabla" → armas):**
```json
{
  "piso_numero": 3,
  "tipo_habitacion_id": 1,
  "rango_min": 18,
  "rango_max": 19,
  "tipo_resultado": "subtabla",
  "subtabla_nombre": "armas",
  "descripcion": "Arma encontrada"
}
```

> `tipo_resultado` valores: `nada`, `oro`, `subtabla`
>
> `subtabla_nombre` valores posibles: `armas`, `armaduras`, `objetos_curiosos`, `items_boss`, `pociones`, `tesoro_menor`, `critico`

### Subtabla: Armas

```
GET    /api/recompensas/armas       → Todas
POST   /api/recompensas/armas       → Crear
DELETE /api/recompensas/armas/:id   → Eliminar
```

```json
{ "tirada": 7, "item_id": 5 }
```

> Una sola tabla global. El modificador de tier se aplica automáticamente en gameplay.

### Subtabla: Armaduras

```
GET    /api/recompensas/armaduras       → Todas
POST   /api/recompensas/armaduras       → Crear
DELETE /api/recompensas/armaduras/:id   → Eliminar
```

```json
{ "tirada": 3, "item_id": 10 }
```

### Subtabla: Objetos Curiosos

```
GET    /api/recompensas/objetos-curiosos       → Todos
POST   /api/recompensas/objetos-curiosos       → Crear
DELETE /api/recompensas/objetos-curiosos/:id   → Eliminar
```

```json
{
  "piso_numero": 3,
  "tipo_habitacion_id": 1,
  "tirada": 5,
  "item_id": 20
}
```

> Varía por piso Y habitación.

### Subtabla: Items de Boss

```
GET    /api/recompensas/items-boss       → Todos
POST   /api/recompensas/items-boss       → Crear
DELETE /api/recompensas/items-boss/:id   → Eliminar
```

```json
{
  "piso_numero": 3,
  "tirada": 12,
  "item_id": 30
}
```

> Varía por piso solamente.

### Subtabla: Pociones

```
GET    /api/recompensas/pociones       → Todas
POST   /api/recompensas/pociones       → Crear
DELETE /api/recompensas/pociones/:id   → Eliminar
```

```json
{
  "piso_numero": 3,
  "tirada": 8,
  "item_id": 15
}
```

> `piso_numero` es opcional. Si no se indica, la poción aplica a todos los pisos.

### Subtabla: Tesoro Menor

```
GET    /api/recompensas/tesoro-menor       → Todos
POST   /api/recompensas/tesoro-menor       → Crear
DELETE /api/recompensas/tesoro-menor/:id   → Eliminar
```

```json
{
  "tirada": 4,
  "item_id": 25,
  "efecto_especial": "Brilla en la oscuridad"
}
```

> `item_id` y `efecto_especial` son opcionales. Puede tener solo efecto sin item.

### Subtabla: Crítico

```
GET    /api/recompensas/critico       → Todos
POST   /api/recompensas/critico       → Crear
DELETE /api/recompensas/critico/:id   → Eliminar
```

```json
{
  "tirada": 20,
  "item_id": 50,
  "piso_numero": 3
}
```

---

## 8. Gameplay (Endpoints Inteligentes)

### Flujo Integrado por Sala

Estos son los endpoints principales para ejecutar una expedición sala por sala:

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/gameplay/generar-layout-piso` | Genera las salas de un piso |
| POST | `/gameplay/resolver-encuentro-habitacion` | Resuelve enemigos de una sala |
| POST | `/gameplay/procesar-recompensas-habitacion` | Preview de recompensas (1d20 por enemigo) |
| POST | `/gameplay/asignar-item` | Asigna un item a un jugador específico |
| POST | `/gameplay/repartir-oro-habitacion` | Reparte oro entre activos automáticamente |
| POST | `/gameplay/completar-habitacion/:id` | Marca sala como completada |
| GET | `/gameplay/participantes-activos/:expedicionId` | Lista participantes activos |

> Ver [Flujo Completo](#2-flujo-completo-de-una-expedición-integrado) para ejemplos detallados de cada endpoint.

### Generar Layout de Piso

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

> Genera automáticamente N comunes (según `num_habitaciones_comunes` del piso) + bonus (opcional) + evento (opcional) + jefe (siempre).
> Actualiza `piso_actual` de la expedición. No se puede volver a generar un piso que ya fue generado.

### Resolver Encuentro de Habitación

```
POST /api/gameplay/resolver-encuentro-habitacion
```

```json
{
  "historial_habitacion_id": 1,
  "tirada": 14
}
```

> Lee automáticamente el piso y tipo de habitación del registro. Persiste la tirada y cantidad de enemigos.

### Procesar Recompensas de Habitación (Preview)

```
POST /api/gameplay/procesar-recompensas-habitacion
```

```json
{
  "historial_habitacion_id": 1,
  "tiradas": [
    { "tirada_d20": 14, "tirada_subtabla": 7 },
    { "tirada_d20": 8 },
    { "tirada_d20": 2 }
  ]
}
```

> **No persiste nada.** Es un preview para que el DM vea los resultados y decida.
> Retorna `items_pendientes` (para asignar con `asignar-item`) y `oro_dados` (dados a tirar para oro).

### Asignar Item

```
POST /api/gameplay/asignar-item
```

```json
{
  "historial_habitacion_id": 1,
  "participacion_id": 1,
  "tirada_original": 14,
  "tirada_subtabla": 7,
  "item_id": 5,
  "modificador_tier": 0
}
```

> Crea un registro `historial_recompensa` vinculando el item al participante.

### Repartir Oro por Habitación

```
POST /api/gameplay/repartir-oro-habitacion
```

```json
{
  "historial_habitacion_id": 1,
  "oro_total": 9
}
```

> Obtiene automáticamente los participantes ACTIVOS y reparte equitativamente.
> No necesita pasar IDs de participantes — los busca de la expedición.

### Completar Habitación

```
POST /api/gameplay/completar-habitacion/1
```

> Marca la sala como completada. No se pueden resolver más encuentros ni recompensas en ella.

### Participantes Activos

```
GET /api/gameplay/participantes-activos/1
```

> Retorna solo los participantes con `activo = true`.

---

### Endpoints Originales (bajo nivel)

Estos endpoints siguen disponibles para uso directo sin el flujo integrado:

### Resolver Encuentro

Dado un piso, tipo de habitación y el resultado de 1d20, retorna qué enemigos aparecen.

```
POST /api/gameplay/resolver-encuentro
```

```json
{
  "piso": 3,
  "tipo_habitacion_id": 1,
  "tirada": 14
}
```

**Response 200:**
```json
{
  "piso": 3,
  "tipo_habitacion_id": 1,
  "tirada": 14,
  "cantidad_total": 4,
  "enemigos": [
    { "nombre": "Esqueleto", "max_cantidad": 2 },
    { "nombre": "Zombie", "max_cantidad": 2 }
  ]
}
```

### Resolver Recompensa

Resuelve toda la cadena de recompensa automáticamente.

#### Caso 1: Solo tirada principal (sin saber si necesita subtabla)

```
POST /api/gameplay/resolver-recompensa
```

```json
{
  "piso": 3,
  "tipo_habitacion_id": 1,
  "tirada_d20": 14
}
```

Si cae en "nada" o "oro", devuelve el resultado final directamente.

Si cae en "subtabla", devuelve `requiere_subtabla: true`:

```json
{
  "piso": 3,
  "tipo_habitacion_id": 1,
  "tirada_original": 14,
  "bonus_recompensa": 4,
  "tirada_con_bonus": 18,
  "tipo_resultado": "subtabla",
  "subtabla_nombre": "armas",
  "descripcion": "Arma encontrada",
  "requiere_subtabla": true
}
```

#### Caso 2: Con ambas tiradas (resuelve todo de una)

```json
{
  "piso": 3,
  "tipo_habitacion_id": 1,
  "tirada_d20": 14,
  "tirada_subtabla": 7
}
```

**Response 200:**
```json
{
  "piso": 3,
  "tipo_habitacion_id": 1,
  "tirada_original": 14,
  "bonus_recompensa": 4,
  "tirada_con_bonus": 18,
  "tipo_resultado": "subtabla",
  "subtabla_nombre": "armas",
  "tirada_subtabla": 7,
  "requiere_subtabla": false,
  "item_nombre": "Espada larga",
  "item_id": 5,
  "modificador_tier": 0,
  "descripcion": "Arma encontrada"
}
```

> Si `tirada_subtabla` viene vacío y se necesita subtabla, la API responde con `requiere_subtabla: true` para que el front pida al DM que tire de nuevo.

### Repartir Oro

Cuando la recompensa es "oro", el DM tira los dados, obtiene un total, y lo reparte entre los jugadores que elija.

```
POST /api/gameplay/repartir-oro
```

```json
{
  "historial_habitacion_id": 1,
  "oro_total": 9,
  "participacion_ids": [1, 2, 3]
}
```

**Response 200:**
```json
{
  "repartos": [
    { "participacion_id": 1, "oro": 3 },
    { "participacion_id": 2, "oro": 3 },
    { "participacion_id": 3, "oro": 3 }
  ]
}
```

> Crea un registro `historial_recompensa` por cada participante con su `oro_obtenido`.
> El sobrante (si no es divisible) se reparte 1 extra a los primeros.

### Resumen de Expedición

Vista completa de lo obtenido por cada personaje durante la expedición.

```
GET /api/gameplay/resumen-expedicion/:expedicionId
```

**Response 200:** Ver [Paso 9 del flujo completo](#paso-9-ver-resumen-antes-de-repartir) para el ejemplo detallado.

### Liquidar Recompensas

Aplica decisiones de venta en lote y calcula el oro final por personaje.

```
POST /api/gameplay/liquidar-recompensas
```

```json
{
  "expedicion_id": 1,
  "decisiones": [
    { "recompensa_id": 1, "vendido": false },
    { "recompensa_id": 3, "vendido": true, "precio_venta": 25 },
    { "recompensa_id": 7, "vendido": true, "precio_venta": 10 }
  ]
}
```

**Response 200:** Ver [Paso 10 del flujo completo](#paso-10-liquidar-recompensas-decidir-ventas-y-calcular-oro-final) para el ejemplo detallado.

> Actualiza automáticamente `participacion.oro_acumulado` para cada personaje.

---

## 9. Historial

### Habitaciones visitadas

```
GET    /api/historial/expedicion/:expedicionId    → Historial completo de una expedición
GET    /api/historial/habitaciones/:id            → Detalle de una habitación
POST   /api/historial/habitaciones                → Registrar habitación
PUT    /api/historial/habitaciones/:id            → Actualizar
DELETE /api/historial/habitaciones/:id            → Eliminar
```

**Registrar habitación:**
```json
{
  "expedicion_id": 1,
  "piso_numero": 3,
  "tipo_habitacion_id": 1,
  "orden": 1,
  "tirada_encuentro": 14,
  "enemigos_derrotados": 4,
  "completada": true,
  "notas": "2 Esqueletos + 2 Zombies"
}
```

### Recompensas por habitación

```
GET    /api/historial/habitaciones/:habitacionId/recompensas   → Recompensas de una habitación
GET    /api/historial/recompensas/:id                          → Detalle de una recompensa
POST   /api/historial/recompensas                              → Registrar recompensa
PUT    /api/historial/recompensas/:id                          → Actualizar (ej: marcar vendido)
DELETE /api/historial/recompensas/:id                          → Eliminar
```

**Registrar recompensa:**
```json
{
  "historial_habitacion_id": 1,
  "participacion_id": 1,
  "tirada_original": 16,
  "tirada_subtabla": 7,
  "item_id": 5,
  "modificador_tier": 0,
  "oro_obtenido": 0,
  "vendido": false
}
```

**Marcar como vendido:**
```json
{
  "vendido": true,
  "precio_venta": 25
}
```

---

## 10. Enums y Valores

### EstadoExpedicion
| Valor | Descripción |
|-------|-------------|
| `pendiente` | Expedición creada, no iniciada |
| `en_curso` | Expedición en progreso |
| `completada` | Expedición finalizada |
| `cancelada` | Expedición cancelada |

### TipoItem
| Valor | Descripción |
|-------|-------------|
| `consumible` | Item de un solo uso |
| `equipo` | Equipamiento general |
| `arma` | Arma |
| `armadura` | Armadura |
| `material` | Material de crafting |
| `otro` | Otro tipo |

### TipoResultadoRecompensa
| Valor | Descripción |
|-------|-------------|
| `nada` | Sin recompensa |
| `oro` | Monedas (tirar dados_oro) |
| `subtabla` | Ir a una subtabla |

### RolUsuario
| Valor | Descripción |
|-------|-------------|
| `player` | Jugador (sin acceso a gestión) |
| `dm` | Dungeon Master (acceso completo) |
| `admin` | Administrador (acceso completo) |

### Subtablas disponibles
| Nombre | Varía por piso | Varía por habitación | Aplica mod tier |
|--------|:--------------:|:--------------------:|:--------------:|
| `armas` | No | No | Si (+armas) |
| `armaduras` | No | No | Si (+armaduras) |
| `objetos_curiosos` | Si | Si | No |
| `items_boss` | Si | No | No |
| `pociones` | Opcional | No | No |
| `tesoro_menor` | Opcional | No | No |
| `critico` | Opcional | No | No |

### Bonus de recompensa por piso
| Piso | Tier | Bonus |
|------|------|-------|
| 1, 6, 11, 16 | 1/2/3/4 | +0 |
| 2, 7, 12, 17 | 1/2/3/4 | +2 |
| 3, 8, 13, 18 | 1/2/3/4 | +4 |
| 4, 9, 14, 19 | 1/2/3/4 | +6 |
| 5, 10, 15, 20 | 1/2/3/4 | +8 |

### Modificadores de tier
| Tier | Pisos | Mod Armas | Mod Armaduras |
|------|-------|-----------|---------------|
| 1 | 1-5 | +0 | +0 |
| 2 | 6-10 | +1 | +1 |
| 3 | 11-15 | +2 | +2 |
| 4 | 16-20 | +3 | +3 |

---

## Manejo de Errores

Todos los errores siguen el formato estándar de NestJS:

```json
{
  "statusCode": 404,
  "message": "Piso 25 no encontrado",
  "error": "Not Found"
}
```

| Código | Cuándo |
|--------|--------|
| 400 | Validación de DTO fallida (campos requeridos, rangos) |
| 401 | Token JWT inválido o expirado |
| 403 | Rol insuficiente (player intentando acceder a DM endpoints) |
| 404 | Recurso no encontrado (piso, item, encuentro, etc.) |
| 409 | Conflicto (email duplicado, participación duplicada) |
