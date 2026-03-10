import { MigrationInterface, QueryRunner } from 'typeorm';

export class RestructureTiersAndBonus1700000000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Remove FK constraint from pisos to tiers
    await queryRunner.query(`
      ALTER TABLE expediciones.pisos DROP CONSTRAINT IF EXISTS "FK_pisos_tier_id"
    `);
    // Try alternative constraint name
    await queryRunner.query(`
      ALTER TABLE expediciones.pisos
        DROP CONSTRAINT IF EXISTS "FK_pisos_tiers"
    `);
    // Drop any FK on tier_id column
    await queryRunner.query(`
      DO $$
      DECLARE r RECORD;
      BEGIN
        FOR r IN (
          SELECT conname FROM pg_constraint
          WHERE conrelid = 'expediciones.pisos'::regclass
            AND contype = 'f'
        ) LOOP
          EXECUTE 'ALTER TABLE expediciones.pisos DROP CONSTRAINT ' || quote_ident(r.conname);
        END LOOP;
      END $$
    `);

    // 2. Drop check constraint on tiers.numero (BETWEEN 1 AND 4)
    await queryRunner.query(`
      DO $$
      DECLARE r RECORD;
      BEGIN
        FOR r IN (
          SELECT conname FROM pg_constraint
          WHERE conrelid = 'expediciones.tiers'::regclass
            AND contype = 'c'
            AND pg_get_constraintdef(oid) LIKE '%numero%'
        ) LOOP
          EXECUTE 'ALTER TABLE expediciones.tiers DROP CONSTRAINT ' || quote_ident(r.conname);
        END LOOP;
      END $$
    `);

    // 3. Delete existing pisos and tiers
    await queryRunner.query(`DELETE FROM expediciones.pisos`);
    await queryRunner.query(`DELETE FROM expediciones.tiers`);

    // 4. Add new check constraint for 5 tiers
    await queryRunner.query(`
      ALTER TABLE expediciones.tiers ADD CONSTRAINT "CHK_tiers_numero" CHECK ("numero" BETWEEN 1 AND 5)
    `);

    // 5. Insert 5 tiers (4 pisos each)
    await queryRunner.query(`
      INSERT INTO expediciones.tiers (numero, piso_min, piso_max, mod_armas, mod_armaduras, descripcion)
      VALUES
        (1, 1,  4,  0, 0, 'Tier 1 - Pisos 1 a 4'),
        (2, 5,  8,  1, 1, 'Tier 2 - Pisos 5 a 8'),
        (3, 9,  12, 2, 2, 'Tier 3 - Pisos 9 a 12'),
        (4, 13, 16, 3, 3, 'Tier 4 - Pisos 13 a 16'),
        (5, 17, 20, 4, 4, 'Tier 5 - Pisos 17 a 20')
    `);

    // 6. Insert 20 pisos with bonus_recompensa pattern: 0, +3, +4, +5 per tier
    await queryRunner.query(`
      INSERT INTO expediciones.pisos (numero, tier_id, bonus_recompensa, num_habitaciones_comunes)
      VALUES
        (1,  (SELECT id FROM expediciones.tiers WHERE numero = 1), 0, 4),
        (2,  (SELECT id FROM expediciones.tiers WHERE numero = 1), 3, 4),
        (3,  (SELECT id FROM expediciones.tiers WHERE numero = 1), 4, 4),
        (4,  (SELECT id FROM expediciones.tiers WHERE numero = 1), 5, 4),
        (5,  (SELECT id FROM expediciones.tiers WHERE numero = 2), 0, 4),
        (6,  (SELECT id FROM expediciones.tiers WHERE numero = 2), 3, 4),
        (7,  (SELECT id FROM expediciones.tiers WHERE numero = 2), 4, 4),
        (8,  (SELECT id FROM expediciones.tiers WHERE numero = 2), 5, 4),
        (9,  (SELECT id FROM expediciones.tiers WHERE numero = 3), 0, 4),
        (10, (SELECT id FROM expediciones.tiers WHERE numero = 3), 3, 4),
        (11, (SELECT id FROM expediciones.tiers WHERE numero = 3), 4, 4),
        (12, (SELECT id FROM expediciones.tiers WHERE numero = 3), 5, 4),
        (13, (SELECT id FROM expediciones.tiers WHERE numero = 4), 0, 4),
        (14, (SELECT id FROM expediciones.tiers WHERE numero = 4), 3, 4),
        (15, (SELECT id FROM expediciones.tiers WHERE numero = 4), 4, 4),
        (16, (SELECT id FROM expediciones.tiers WHERE numero = 4), 5, 4),
        (17, (SELECT id FROM expediciones.tiers WHERE numero = 5), 0, 4),
        (18, (SELECT id FROM expediciones.tiers WHERE numero = 5), 3, 4),
        (19, (SELECT id FROM expediciones.tiers WHERE numero = 5), 4, 4),
        (20, (SELECT id FROM expediciones.tiers WHERE numero = 5), 5, 4)
    `);

    // 7. Re-add FK constraint
    await queryRunner.query(`
      ALTER TABLE expediciones.pisos
        ADD CONSTRAINT "FK_pisos_tier_id"
        FOREIGN KEY ("tier_id") REFERENCES expediciones.tiers("id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FK
    await queryRunner.query(`
      ALTER TABLE expediciones.pisos DROP CONSTRAINT IF EXISTS "FK_pisos_tier_id"
    `);

    // Remove data
    await queryRunner.query(`DELETE FROM expediciones.pisos`);
    await queryRunner.query(`DELETE FROM expediciones.tiers`);

    // Drop new check, restore old one
    await queryRunner.query(`
      ALTER TABLE expediciones.tiers DROP CONSTRAINT IF EXISTS "CHK_tiers_numero"
    `);
    await queryRunner.query(`
      ALTER TABLE expediciones.tiers ADD CONSTRAINT "CHK_tiers_numero" CHECK ("numero" BETWEEN 1 AND 4)
    `);

    // Restore original 4 tiers
    await queryRunner.query(`
      INSERT INTO expediciones.tiers (numero, piso_min, piso_max, mod_armas, mod_armaduras, descripcion)
      VALUES
        (1, 1, 5, 0, 0, 'Tier 1 - Pisos 1 a 5'),
        (2, 6, 10, 1, 1, 'Tier 2 - Pisos 6 a 10'),
        (3, 11, 15, 2, 2, 'Tier 3 - Pisos 11 a 15'),
        (4, 16, 20, 3, 3, 'Tier 4 - Pisos 16 a 20')
    `);

    // Restore original 20 pisos with old bonus pattern
    await queryRunner.query(`
      INSERT INTO expediciones.pisos (numero, tier_id, bonus_recompensa, num_habitaciones_comunes)
      VALUES
        (1,  (SELECT id FROM expediciones.tiers WHERE numero = 1), 0, 4),
        (2,  (SELECT id FROM expediciones.tiers WHERE numero = 1), 2, 4),
        (3,  (SELECT id FROM expediciones.tiers WHERE numero = 1), 4, 4),
        (4,  (SELECT id FROM expediciones.tiers WHERE numero = 1), 6, 4),
        (5,  (SELECT id FROM expediciones.tiers WHERE numero = 1), 8, 4),
        (6,  (SELECT id FROM expediciones.tiers WHERE numero = 2), 0, 4),
        (7,  (SELECT id FROM expediciones.tiers WHERE numero = 2), 2, 4),
        (8,  (SELECT id FROM expediciones.tiers WHERE numero = 2), 4, 4),
        (9,  (SELECT id FROM expediciones.tiers WHERE numero = 2), 6, 4),
        (10, (SELECT id FROM expediciones.tiers WHERE numero = 2), 8, 4),
        (11, (SELECT id FROM expediciones.tiers WHERE numero = 3), 0, 4),
        (12, (SELECT id FROM expediciones.tiers WHERE numero = 3), 2, 4),
        (13, (SELECT id FROM expediciones.tiers WHERE numero = 3), 4, 4),
        (14, (SELECT id FROM expediciones.tiers WHERE numero = 3), 6, 4),
        (15, (SELECT id FROM expediciones.tiers WHERE numero = 3), 8, 4),
        (16, (SELECT id FROM expediciones.tiers WHERE numero = 4), 0, 4),
        (17, (SELECT id FROM expediciones.tiers WHERE numero = 4), 2, 4),
        (18, (SELECT id FROM expediciones.tiers WHERE numero = 4), 4, 4),
        (19, (SELECT id FROM expediciones.tiers WHERE numero = 4), 6, 4),
        (20, (SELECT id FROM expediciones.tiers WHERE numero = 4), 8, 4)
    `);

    // Re-add FK
    await queryRunner.query(`
      ALTER TABLE expediciones.pisos
        ADD CONSTRAINT "FK_pisos_tier_id"
        FOREIGN KEY ("tier_id") REFERENCES expediciones.tiers("id")
    `);
  }
}
