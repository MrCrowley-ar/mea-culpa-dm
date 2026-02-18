import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakePasswordNullableForPlayers1700000000005
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE expediciones.usuarios
      ALTER COLUMN password_hash DROP NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE expediciones.usuarios
      SET password_hash = ''
      WHERE password_hash IS NULL
    `);
    await queryRunner.query(`
      ALTER TABLE expediciones.usuarios
      ALTER COLUMN password_hash SET NOT NULL
    `);
  }
}
