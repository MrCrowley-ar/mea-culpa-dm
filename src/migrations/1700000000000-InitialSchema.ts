import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create schema
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS expediciones`);

    // Create enum types
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE expediciones.rol_usuario AS ENUM ('player', 'dm', 'admin');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE expediciones.estado_expedicion AS ENUM ('pendiente', 'en_curso', 'completada', 'cancelada');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE expediciones.tipo_item AS ENUM ('consumible', 'equipo', 'arma', 'armadura', 'material', 'otro');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE expediciones.tipo_resultado_recompensa AS ENUM ('nada', 'oro', 'subtabla');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    // ========================
    // CORE TABLES
    // ========================

    // usuarios
    await queryRunner.query(`
      CREATE TABLE expediciones.usuarios (
        discord_id VARCHAR(32) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        rol expediciones.rol_usuario NOT NULL DEFAULT 'player',
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // refresh_tokens
    await queryRunner.query(`
      CREATE TABLE expediciones.refresh_tokens (
        id SERIAL PRIMARY KEY,
        usuario_id VARCHAR(32) NOT NULL REFERENCES expediciones.usuarios(discord_id) ON DELETE CASCADE,
        token VARCHAR(500) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // tiers
    await queryRunner.query(`
      CREATE TABLE expediciones.tiers (
        id SERIAL PRIMARY KEY,
        numero INT NOT NULL UNIQUE CHECK (numero BETWEEN 1 AND 4),
        piso_min INT NOT NULL,
        piso_max INT NOT NULL,
        mod_armas INT NOT NULL DEFAULT 0,
        mod_armaduras INT NOT NULL DEFAULT 0,
        descripcion VARCHAR(100),
        CHECK (piso_min <= piso_max)
      )
    `);

    // pisos
    await queryRunner.query(`
      CREATE TABLE expediciones.pisos (
        numero INT PRIMARY KEY CHECK (numero BETWEEN 1 AND 20),
        tier_id INT NOT NULL REFERENCES expediciones.tiers(id),
        bonus_recompensa INT NOT NULL DEFAULT 0,
        num_habitaciones_comunes INT NOT NULL DEFAULT 4
      )
    `);

    // tipos_habitacion
    await queryRunner.query(`
      CREATE TABLE expediciones.tipos_habitacion (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL UNIQUE,
        usa_tabla_boss BOOLEAN NOT NULL DEFAULT false,
        descripcion TEXT
      )
    `);

    // items
    await queryRunner.query(`
      CREATE TABLE expediciones.items (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        tipo expediciones.tipo_item NOT NULL,
        precio_base INT,
        dados_precio VARCHAR(20),
        descripcion TEXT,
        es_base_modificable BOOLEAN NOT NULL DEFAULT false,
        CHECK (precio_base IS NOT NULL OR dados_precio IS NOT NULL)
      )
    `);

    // expediciones
    await queryRunner.query(`
      CREATE TABLE expediciones.expediciones (
        id SERIAL PRIMARY KEY,
        organizador_id VARCHAR(32) NOT NULL REFERENCES expediciones.usuarios(discord_id),
        fecha TIMESTAMP NOT NULL DEFAULT now(),
        estado expediciones.estado_expedicion NOT NULL DEFAULT 'pendiente',
        piso_actual INT NOT NULL DEFAULT 1,
        notas TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // participaciones
    await queryRunner.query(`
      CREATE TABLE expediciones.participaciones (
        id SERIAL PRIMARY KEY,
        expedicion_id INT NOT NULL REFERENCES expediciones.expediciones(id) ON DELETE CASCADE,
        usuario_id VARCHAR(32) NOT NULL REFERENCES expediciones.usuarios(discord_id),
        nombre_personaje VARCHAR(100) NOT NULL,
        oro_acumulado INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        UNIQUE (expedicion_id, usuario_id)
      )
    `);

    // ========================
    // ENCOUNTER TABLES
    // ========================

    // tipos_enemigo
    await queryRunner.query(`
      CREATE TABLE expediciones.tipos_enemigo (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        piso_id INT NOT NULL REFERENCES expediciones.pisos(numero),
        descripcion TEXT,
        UNIQUE (nombre, piso_id)
      )
    `);

    // tabla_encuentros
    await queryRunner.query(`
      CREATE TABLE expediciones.tabla_encuentros (
        id SERIAL PRIMARY KEY,
        piso_numero INT NOT NULL REFERENCES expediciones.pisos(numero),
        tipo_habitacion_id INT NOT NULL REFERENCES expediciones.tipos_habitacion(id),
        rango_min INT NOT NULL,
        rango_max INT NOT NULL,
        cantidad_total INT NOT NULL,
        CHECK (rango_min <= rango_max),
        CHECK (rango_min >= 1 AND rango_max <= 20)
      )
    `);

    // encuentro_enemigos
    await queryRunner.query(`
      CREATE TABLE expediciones.encuentro_enemigos (
        id SERIAL PRIMARY KEY,
        tabla_encuentro_id INT NOT NULL REFERENCES expediciones.tabla_encuentros(id) ON DELETE CASCADE,
        tipo_enemigo_id INT NOT NULL REFERENCES expediciones.tipos_enemigo(id),
        max_cantidad INT,
        UNIQUE (tabla_encuentro_id, tipo_enemigo_id)
      )
    `);

    // ========================
    // REWARD TABLES
    // ========================

    // tabla_recompensas
    await queryRunner.query(`
      CREATE TABLE expediciones.tabla_recompensas (
        id SERIAL PRIMARY KEY,
        piso_numero INT NOT NULL REFERENCES expediciones.pisos(numero),
        tipo_habitacion_id INT NOT NULL REFERENCES expediciones.tipos_habitacion(id),
        rango_min INT NOT NULL,
        rango_max INT NOT NULL,
        tipo_resultado expediciones.tipo_resultado_recompensa NOT NULL,
        dados_oro VARCHAR(20),
        subtabla_nombre VARCHAR(50),
        descripcion VARCHAR(100),
        CHECK (rango_min <= rango_max),
        CHECK (rango_min >= 1 AND rango_max <= 20)
      )
    `);

    // tabla_objetos_curiosos
    await queryRunner.query(`
      CREATE TABLE expediciones.tabla_objetos_curiosos (
        id SERIAL PRIMARY KEY,
        piso_numero INT NOT NULL REFERENCES expediciones.pisos(numero),
        tipo_habitacion_id INT NOT NULL REFERENCES expediciones.tipos_habitacion(id),
        tirada INT NOT NULL CHECK (tirada BETWEEN 1 AND 20),
        item_id INT NOT NULL REFERENCES expediciones.items(id),
        UNIQUE (piso_numero, tipo_habitacion_id, tirada)
      )
    `);

    // tabla_items_boss
    await queryRunner.query(`
      CREATE TABLE expediciones.tabla_items_boss (
        id SERIAL PRIMARY KEY,
        piso_numero INT NOT NULL REFERENCES expediciones.pisos(numero),
        tirada INT NOT NULL CHECK (tirada BETWEEN 1 AND 20),
        item_id INT NOT NULL REFERENCES expediciones.items(id),
        UNIQUE (piso_numero, tirada)
      )
    `);

    // tabla_armas
    await queryRunner.query(`
      CREATE TABLE expediciones.tabla_armas (
        id SERIAL PRIMARY KEY,
        tirada INT NOT NULL UNIQUE CHECK (tirada BETWEEN 1 AND 20),
        item_id INT NOT NULL REFERENCES expediciones.items(id)
      )
    `);

    // tabla_armaduras
    await queryRunner.query(`
      CREATE TABLE expediciones.tabla_armaduras (
        id SERIAL PRIMARY KEY,
        tirada INT NOT NULL UNIQUE CHECK (tirada BETWEEN 1 AND 20),
        item_id INT NOT NULL REFERENCES expediciones.items(id)
      )
    `);

    // tabla_pociones
    await queryRunner.query(`
      CREATE TABLE expediciones.tabla_pociones (
        id SERIAL PRIMARY KEY,
        piso_numero INT REFERENCES expediciones.pisos(numero),
        tirada INT NOT NULL CHECK (tirada BETWEEN 1 AND 20),
        item_id INT NOT NULL REFERENCES expediciones.items(id)
      )
    `);

    // tabla_tesoro_menor
    await queryRunner.query(`
      CREATE TABLE expediciones.tabla_tesoro_menor (
        id SERIAL PRIMARY KEY,
        piso_numero INT REFERENCES expediciones.pisos(numero),
        tirada INT NOT NULL CHECK (tirada BETWEEN 1 AND 20),
        item_id INT REFERENCES expediciones.items(id),
        efecto_especial VARCHAR(100)
      )
    `);

    // tabla_critico
    await queryRunner.query(`
      CREATE TABLE expediciones.tabla_critico (
        id SERIAL PRIMARY KEY,
        piso_numero INT REFERENCES expediciones.pisos(numero),
        tirada INT NOT NULL CHECK (tirada BETWEEN 1 AND 20),
        item_id INT NOT NULL REFERENCES expediciones.items(id)
      )
    `);

    // ========================
    // HISTORY TABLES
    // ========================

    // historial_habitaciones
    await queryRunner.query(`
      CREATE TABLE expediciones.historial_habitaciones (
        id SERIAL PRIMARY KEY,
        expedicion_id INT NOT NULL REFERENCES expediciones.expediciones(id) ON DELETE CASCADE,
        piso_numero INT NOT NULL,
        tipo_habitacion_id INT NOT NULL REFERENCES expediciones.tipos_habitacion(id),
        orden INT NOT NULL,
        tirada_encuentro INT,
        enemigos_derrotados INT NOT NULL DEFAULT 0,
        completada BOOLEAN NOT NULL DEFAULT false,
        notas TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // historial_recompensas
    await queryRunner.query(`
      CREATE TABLE expediciones.historial_recompensas (
        id SERIAL PRIMARY KEY,
        historial_habitacion_id INT NOT NULL REFERENCES expediciones.historial_habitaciones(id) ON DELETE CASCADE,
        participacion_id INT NOT NULL REFERENCES expediciones.participaciones(id),
        tirada_original INT NOT NULL,
        tirada_subtabla INT,
        item_id INT REFERENCES expediciones.items(id),
        modificador_tier INT,
        oro_obtenido INT NOT NULL DEFAULT 0,
        vendido BOOLEAN NOT NULL DEFAULT false,
        precio_venta INT,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // ========================
    // HELPER FUNCTIONS
    // ========================

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION expediciones.get_bonus_recompensa(p_piso INT)
      RETURNS INT AS $$
      BEGIN
        RETURN (SELECT bonus_recompensa FROM expediciones.pisos WHERE numero = p_piso);
      END;
      $$ LANGUAGE plpgsql STABLE;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION expediciones.get_mod_armas(p_piso INT)
      RETURNS INT AS $$
      BEGIN
        RETURN (
          SELECT t.mod_armas
          FROM expediciones.pisos p
          JOIN expediciones.tiers t ON p.tier_id = t.id
          WHERE p.numero = p_piso
        );
      END;
      $$ LANGUAGE plpgsql STABLE;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION expediciones.get_mod_armaduras(p_piso INT)
      RETURNS INT AS $$
      BEGIN
        RETURN (
          SELECT t.mod_armaduras
          FROM expediciones.pisos p
          JOIN expediciones.tiers t ON p.tier_id = t.id
          WHERE p.numero = p_piso
        );
      END;
      $$ LANGUAGE plpgsql STABLE;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION expediciones.puede_organizar_expedicion(p_usuario_id VARCHAR)
      RETURNS BOOLEAN AS $$
      BEGIN
        RETURN (
          SELECT rol IN ('dm', 'admin')
          FROM expediciones.usuarios
          WHERE discord_id = p_usuario_id
        );
      END;
      $$ LANGUAGE plpgsql STABLE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop functions
    await queryRunner.query(`DROP FUNCTION IF EXISTS expediciones.puede_organizar_expedicion`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS expediciones.get_mod_armaduras`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS expediciones.get_mod_armas`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS expediciones.get_bonus_recompensa`);

    // Drop history tables
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.historial_recompensas`);
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.historial_habitaciones`);

    // Drop reward tables
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.tabla_critico`);
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.tabla_tesoro_menor`);
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.tabla_pociones`);
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.tabla_armaduras`);
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.tabla_armas`);
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.tabla_items_boss`);
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.tabla_objetos_curiosos`);
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.tabla_recompensas`);

    // Drop encounter tables
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.encuentro_enemigos`);
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.tabla_encuentros`);
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.tipos_enemigo`);

    // Drop core tables
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.participaciones`);
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.expediciones`);
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.items`);
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.tipos_habitacion`);
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.pisos`);
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.tiers`);
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.refresh_tokens`);
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.usuarios`);

    // Drop types
    await queryRunner.query(`DROP TYPE IF EXISTS expediciones.tipo_resultado_recompensa`);
    await queryRunner.query(`DROP TYPE IF EXISTS expediciones.tipo_item`);
    await queryRunner.query(`DROP TYPE IF EXISTS expediciones.estado_expedicion`);
    await queryRunner.query(`DROP TYPE IF EXISTS expediciones.rol_usuario`);

    // Drop schema
    await queryRunner.query(`DROP SCHEMA IF EXISTS expediciones`);
  }
}
