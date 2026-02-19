import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOpcionesEspeciales1700000000006
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create opciones_especiales table
    await queryRunner.query(`
      CREATE TABLE expediciones.opciones_especiales (
        id SERIAL PRIMARY KEY,
        tabla_recompensa_id INT NOT NULL
          REFERENCES expediciones.tabla_recompensas(id) ON DELETE CASCADE,
        nombre VARCHAR(200) NOT NULL
      )
    `);

    // 2. Populate from existing tabla_recompensas entries where subtabla_nombre = 'especial'
    // Split descripcion by '/' and trim each option
    await queryRunner.query(`
      INSERT INTO expediciones.opciones_especiales (tabla_recompensa_id, nombre)
      SELECT tr.id, trim(option)
      FROM expediciones.tabla_recompensas tr,
           unnest(string_to_array(tr.descripcion, '/')) AS option
      WHERE tr.subtabla_nombre = 'especial'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS expediciones.opciones_especiales`,
    );
  }
}
