import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddParticipacionActiveTracking1700000000002
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE expediciones.participaciones
        ADD COLUMN activo BOOLEAN NOT NULL DEFAULT true;
    `);
    await queryRunner.query(`
      ALTER TABLE expediciones.participaciones
        ADD COLUMN sala_salida INT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE expediciones.participaciones DROP COLUMN sala_salida;
    `);
    await queryRunner.query(`
      ALTER TABLE expediciones.participaciones DROP COLUMN activo;
    `);
  }
}
