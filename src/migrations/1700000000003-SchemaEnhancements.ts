import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaEnhancements1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add mod_encuentro to pisos
    await queryRunner.query(`
      ALTER TABLE expediciones.pisos
        ADD COLUMN mod_encuentro INT NOT NULL DEFAULT 0;
    `);

    // Remove UNIQUE constraint on tabla_armaduras.tirada and add contexto
    await queryRunner.query(`
      ALTER TABLE expediciones.tabla_armaduras
        DROP CONSTRAINT IF EXISTS "UQ_tabla_armaduras_tirada",
        ADD COLUMN contexto VARCHAR(20);
    `);
    // Also try the auto-generated constraint name
    await queryRunner.query(`
      DO $$ BEGIN
        EXECUTE (
          SELECT 'ALTER TABLE expediciones.tabla_armaduras DROP CONSTRAINT ' || conname
          FROM pg_constraint
          WHERE conrelid = 'expediciones.tabla_armaduras'::regclass
            AND contype = 'u'
          LIMIT 1
        );
      EXCEPTION WHEN OTHERS THEN NULL;
      END $$;
    `);

    // Add variante to tabla_items_boss and update unique constraint
    await queryRunner.query(`
      ALTER TABLE expediciones.tabla_items_boss
        ADD COLUMN variante VARCHAR(50);
    `);
    // Drop old unique constraint and create new one including variante
    await queryRunner.query(`
      DO $$ BEGIN
        EXECUTE (
          SELECT 'ALTER TABLE expediciones.tabla_items_boss DROP CONSTRAINT ' || conname
          FROM pg_constraint
          WHERE conrelid = 'expediciones.tabla_items_boss'::regclass
            AND contype = 'u'
          LIMIT 1
        );
      EXCEPTION WHEN OTHERS THEN NULL;
      END $$;
    `);
    await queryRunner.query(`
      ALTER TABLE expediciones.tabla_items_boss
        ADD CONSTRAINT "UQ_items_boss_piso_variante_tirada"
        UNIQUE (piso_numero, variante, tirada);
    `);

    // Make piso_numero and tipo_habitacion_id nullable in tabla_objetos_curiosos
    await queryRunner.query(`
      ALTER TABLE expediciones.tabla_objetos_curiosos
        ALTER COLUMN piso_numero DROP NOT NULL,
        ALTER COLUMN tipo_habitacion_id DROP NOT NULL;
    `);
    // Drop old unique constraint (piso_numero, tipo_habitacion_id, tirada)
    await queryRunner.query(`
      DO $$ BEGIN
        EXECUTE (
          SELECT 'ALTER TABLE expediciones.tabla_objetos_curiosos DROP CONSTRAINT ' || conname
          FROM pg_constraint
          WHERE conrelid = 'expediciones.tabla_objetos_curiosos'::regclass
            AND contype = 'u'
          LIMIT 1
        );
      EXCEPTION WHEN OTHERS THEN NULL;
      END $$;
    `);

    // Create tabla_eventos_bonus
    await queryRunner.query(`
      CREATE TABLE expediciones.tabla_eventos_bonus (
        id SERIAL PRIMARY KEY,
        tier_numero INT NOT NULL REFERENCES expediciones.tiers(numero),
        rango_min INT NOT NULL,
        rango_max INT NOT NULL,
        evento VARCHAR(100) NOT NULL,
        detalles TEXT,
        recompensa VARCHAR(200),
        CHECK (rango_min <= rango_max),
        CHECK (rango_min >= 1 AND rango_max <= 20)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.tabla_eventos_bonus`);

    // Restore tabla_objetos_curiosos constraints
    await queryRunner.query(`
      ALTER TABLE expediciones.tabla_objetos_curiosos
        ALTER COLUMN piso_numero SET NOT NULL,
        ALTER COLUMN tipo_habitacion_id SET NOT NULL;
    `);
    await queryRunner.query(`
      ALTER TABLE expediciones.tabla_objetos_curiosos
        ADD CONSTRAINT "UQ_objetos_curiosos_piso_tipo_tirada"
        UNIQUE (piso_numero, tipo_habitacion_id, tirada);
    `);

    // Restore tabla_items_boss
    await queryRunner.query(`
      ALTER TABLE expediciones.tabla_items_boss
        DROP CONSTRAINT IF EXISTS "UQ_items_boss_piso_variante_tirada";
    `);
    await queryRunner.query(`
      ALTER TABLE expediciones.tabla_items_boss
        DROP COLUMN variante,
        ADD CONSTRAINT "UQ_items_boss_piso_tirada" UNIQUE (piso_numero, tirada);
    `);

    // Restore tabla_armaduras
    await queryRunner.query(`
      ALTER TABLE expediciones.tabla_armaduras
        DROP COLUMN contexto,
        ADD CONSTRAINT "UQ_tabla_armaduras_tirada" UNIQUE (tirada);
    `);

    // Remove mod_encuentro from pisos
    await queryRunner.query(`
      ALTER TABLE expediciones.pisos DROP COLUMN mod_encuentro;
    `);
  }
}
