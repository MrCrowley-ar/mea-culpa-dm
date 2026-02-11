import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedData1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Seed tiers
    await queryRunner.query(`
      INSERT INTO expediciones.tiers (numero, piso_min, piso_max, mod_armas, mod_armaduras, descripcion)
      VALUES
        (1, 1, 5, 0, 0, 'Tier 1 - Pisos 1 a 5'),
        (2, 6, 10, 1, 1, 'Tier 2 - Pisos 6 a 10'),
        (3, 11, 15, 2, 2, 'Tier 3 - Pisos 11 a 15'),
        (4, 16, 20, 3, 3, 'Tier 4 - Pisos 16 a 20')
    `);

    // Seed pisos with bonus_recompensa pattern: +0, +2, +4, +6, +8 per tier
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

    // Seed tipos_habitacion
    await queryRunner.query(`
      INSERT INTO expediciones.tipos_habitacion (nombre, usa_tabla_boss, descripcion)
      VALUES
        ('comun', false, 'Habitación común con encuentros estándar'),
        ('bonus', false, 'Habitación bonus con recompensas adicionales'),
        ('jefe', true, 'Habitación de jefe con tabla de items boss'),
        ('evento', false, 'Habitación de evento especial')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM expediciones.tipos_habitacion`);
    await queryRunner.query(`DELETE FROM expediciones.pisos`);
    await queryRunner.query(`DELETE FROM expediciones.tiers`);
  }
}
