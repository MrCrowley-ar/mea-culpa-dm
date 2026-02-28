import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEstadoSnapshotToExpediciones1700000000007
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE expediciones.expediciones
      ADD COLUMN estado_snapshot JSONB DEFAULT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE expediciones.expediciones
      DROP COLUMN IF EXISTS estado_snapshot
    `);
  }
}
