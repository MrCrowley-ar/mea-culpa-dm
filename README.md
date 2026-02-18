# Sistema de Expediciones

**Documento de Diseño de Base de Datos**

---

## 1. Introducción

Este documento describe el diseño de la base de datos para un sistema de gestión de expediciones de un juego de mesa tipo dungeon crawler que se juega de forma online a través de Discord.

---

## 2. Descripción del Juego

El juego consiste en expediciones organizadas por un Dungeon Master (DM) donde hasta 5 jugadores participan con sus personajes. Cada expedición se desarrolla a través de pisos y habitaciones, enfrentando enemigos y obteniendo recompensas basadas en tiradas de dados.

### 2.1 Estructura de una Expedición

- **Pisos:** 20 pisos en total, agrupados en 4 tiers (1-5, 6-10, 11-15, 16-20)
- **Habitaciones:** Comunes, Bonus, Jefe y Evento
- **Enemigos:** Varían por piso y tipo de habitación
- **Recompensas:** Oro, armas, armaduras, consumibles y objetos especiales

### 2.2 Sistema de Encuentros

Al entrar a una habitación, el DM tira 1d20. El resultado determina la cantidad y tipos de enemigos según una tabla que varía por piso y tipo de habitación. Algunos enemigos tienen límites máximos por encuentro.

### 2.3 Sistema de Recompensas

Al derrotar enemigos, se tira 1d20 por cada uno. El resultado + bonus del piso determina la recompensa:

- Rangos bajos: Nada o cantidades pequeñas de oro
- Rangos medios: Oro, armas usadas, objetos curiosos
- Rangos altos: Pociones, tesoros menores
- Crítico (20): Tabla especial con items únicos

---

## 3. Sistema de Autenticación

### 3.1 Roles de Usuario

El sistema cuenta con tres roles diferenciados:

| Rol | Permisos |
|-----|----------|
| **player** | Puede unirse a expediciones y participar con sus personajes |
| **dm** | Puede crear y organizar expediciones, además de participar como jugador |
| **admin** | Acceso completo: gestión de usuarios, configuración del sistema y todas las funciones de DM |

### 3.2 Autenticación

- **Identificación:** Discord ID (debe estar en la whitelist de IDs permitidos)
- **Contraseña:** Hash con bcrypt
- **Sesiones:** JWT con refresh tokens

---

## 4. Modelo de Datos

### 4.1 Entidades Principales

| Entidad | Descripción |
|---------|-------------|
| **usuarios** | Usuarios con Discord ID, password, rol (player/dm/admin) |
| **allowed_discord_ids** | Whitelist de Discord IDs autorizados para registrarse |
| **refresh_tokens** | Tokens JWT para mantener sesiones activas |
| **expediciones** | Partidas organizadas con fecha, estado y organizador (solo DM/admin) |
| **participaciones** | Relación usuario-expedición con nombre de personaje y oro acumulado |
| **tiers** | Agrupación de pisos con modificadores de armas/armaduras y config de bonus |
| **pisos** | Niveles 1-20, asociados a su tier correspondiente |
| **items** | Todos los objetos del juego con nombre, tipo y precio base |

### 4.2 Tablas de Configuración

El sistema utiliza tablas de lookup para determinar encuentros y recompensas:

| Tabla | Variación |
|-------|-----------|
| tabla_encuentros | Por piso + tipo de habitación |
| tabla_recompensas | Por piso + tipo de habitación |
| tabla_objetos_curiosos | Por piso + tipo de habitación |
| tabla_items_boss | Solo por piso |
| tabla_armas / armaduras | Base única + modificador por tier (+0, +1, +2, +3) |

### 4.3 Historial de Expediciones

El sistema registra todo lo que ocurre en cada expedición para tracking y estadísticas:

- **historial_habitaciones:** Registro de cada habitación jugada, tirada de encuentro y enemigos derrotados
- **historial_recompensas:** Quién recibió cada item (con su modificador de tier aplicado), tracking de ventas

---

## 5. Sistema de Tiers y Bonificaciones

Los pisos se agrupan en 4 tiers. Cada tier tiene sus propios modificadores que se reinician al cambiar de tier:

| Tier | Pisos | Bonus Rec. | Mod. Armas | Mod. Armaduras |
|------|-------|------------|------------|----------------|
| Tier 1 | 1 - 5 | +0 a +8 | +0 | +0 |
| Tier 2 | 6 - 10 | +0 a +8 | +1 | +1 |
| Tier 3 | 11 - 15 | +0 a +8 | +2 | +2 |
| Tier 4 | 16 - 20 | +0 a +8 | +3 | +3 |

### 5.1 Bonus de Recompensa

El bonus de recompensa se suma a la tirada de 1d20 al calcular rewards. Se reinicia en cada tier:

- Piso 1, 6, 11, 16 → +0
- Piso 2, 7, 12, 17 → +2
- Piso 3, 8, 13, 18 → +4
- Piso 4, 9, 14, 19 → +6
- Piso 5, 10, 15, 20 → +8

### 5.2 Modificador de Armas/Armaduras

Cuando un arma o armadura sale como recompensa, se aplica el modificador del tier actual. Por ejemplo, una "Espada larga" en Tier 3 se convierte en "Espada larga +2".

---

## 6. Flujo del Juego

1. **Login:** Usuario se autentica con Discord ID/password
2. **Creación de expedición:** Un DM o admin crea una nueva expedición
3. **Unión de jugadores:** Hasta 5 jugadores se unen eligiendo un personaje
4. **Exploración de habitación:** Se tira 1d20 para determinar enemigos
5. **Combate:** Los jugadores derrotan a los enemigos
6. **Recompensas:** Se tira 1d20 + bonus del piso por cada enemigo
7. **Sorteo:** Items con modificador de tier aplicado se sortean; oro se reparte
8. **Siguiente habitación/piso:** Se continúa hasta completar la expedición

---

## 7. Tecnología

- **Base de datos:** PostgreSQL 16
- **Contenedor:** Docker con docker-compose
- **Schema:** expediciones
- **Autenticación:** JWT + bcrypt para passwords
- **Conexión:** `postgresql://expediciones:expediciones123@localhost:5432/expediciones_db`

---

## 8. Funciones SQL Disponibles

El schema incluye funciones helper para facilitar el desarrollo:

| Función | Descripción |
|---------|-------------|
| `get_bonus_recompensa(piso)` | Calcula el bonus de recompensa del piso |
| `get_mod_armas(piso)` | Retorna el modificador de armas del tier |
| `get_mod_armaduras(piso)` | Retorna el modificador de armaduras del tier |
| `puede_organizar_expedicion(id)` | Verifica si el usuario es DM o admin |