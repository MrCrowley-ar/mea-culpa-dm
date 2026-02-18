import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveEmailAddAllowedDiscordIds1700000000002
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create allowed_discord_ids table
    await queryRunner.query(`
      CREATE TABLE expediciones.allowed_discord_ids (
        discord_id VARCHAR(32) PRIMARY KEY,
        nota VARCHAR(100),
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Remove email column from usuarios
    await queryRunner.query(`
      ALTER TABLE expediciones.usuarios DROP COLUMN email
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Re-add email column to usuarios
    await queryRunner.query(`
      ALTER TABLE expediciones.usuarios
        ADD COLUMN email VARCHAR(255) UNIQUE
    `);

    // Drop allowed_discord_ids table
    await queryRunner.query(`
      DROP TABLE IF EXISTS expediciones.allowed_discord_ids
    `);
  }
}
