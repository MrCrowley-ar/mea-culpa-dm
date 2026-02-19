import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakePasswordNullableForPlayers1700000000005
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Make password nullable
    await queryRunner.query(`
      ALTER TABLE expediciones.usuarios
      ALTER COLUMN password_hash DROP NOT NULL
    `);

    // 2. Create usuario_roles table
    await queryRunner.query(`
      CREATE TABLE expediciones.usuario_roles (
        id SERIAL PRIMARY KEY,
        usuario_id VARCHAR(32) NOT NULL REFERENCES expediciones.usuarios(discord_id) ON DELETE CASCADE,
        rol expediciones.rol_usuario NOT NULL,
        UNIQUE(usuario_id, rol)
      )
    `);

    // 3. Migrate existing roles data from usuarios.rol to usuario_roles
    await queryRunner.query(`
      INSERT INTO expediciones.usuario_roles (usuario_id, rol)
      SELECT discord_id, rol FROM expediciones.usuarios
    `);

    // 4. Drop the old rol column
    await queryRunner.query(`
      ALTER TABLE expediciones.usuarios
      DROP COLUMN rol
    `);

    // 5. Create personajes table
    await queryRunner.query(`
      CREATE TABLE expediciones.personajes (
        id SERIAL PRIMARY KEY,
        usuario_id VARCHAR(32) NOT NULL REFERENCES expediciones.usuarios(discord_id) ON DELETE CASCADE,
        nombre VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // 6. Migrate nombre_personaje from participaciones to personajes
    // Create a personaje for each unique (usuario_id, nombre_personaje) combo
    await queryRunner.query(`
      INSERT INTO expediciones.personajes (usuario_id, nombre)
      SELECT DISTINCT usuario_id, nombre_personaje
      FROM expediciones.participaciones
      WHERE nombre_personaje IS NOT NULL AND nombre_personaje != ''
    `);

    // 7. Add personaje_id column to participaciones
    await queryRunner.query(`
      ALTER TABLE expediciones.participaciones
      ADD COLUMN personaje_id INT
    `);

    // 8. Fill personaje_id from the migrated personajes
    await queryRunner.query(`
      UPDATE expediciones.participaciones p
      SET personaje_id = per.id
      FROM expediciones.personajes per
      WHERE p.usuario_id = per.usuario_id
        AND p.nombre_personaje = per.nombre
    `);

    // 9. Make personaje_id NOT NULL and add FK
    await queryRunner.query(`
      ALTER TABLE expediciones.participaciones
      ALTER COLUMN personaje_id SET NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE expediciones.participaciones
      ADD CONSTRAINT fk_participaciones_personaje
      FOREIGN KEY (personaje_id) REFERENCES expediciones.personajes(id)
    `);

    // 10. Drop nombre_personaje column
    await queryRunner.query(`
      ALTER TABLE expediciones.participaciones
      DROP COLUMN nombre_personaje
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Re-add nombre_personaje to participaciones
    await queryRunner.query(`
      ALTER TABLE expediciones.participaciones
      ADD COLUMN nombre_personaje VARCHAR(100)
    `);

    // 2. Populate nombre_personaje from personajes
    await queryRunner.query(`
      UPDATE expediciones.participaciones p
      SET nombre_personaje = per.nombre
      FROM expediciones.personajes per
      WHERE p.personaje_id = per.id
    `);

    // 3. Drop FK and personaje_id
    await queryRunner.query(`
      ALTER TABLE expediciones.participaciones
      DROP CONSTRAINT IF EXISTS fk_participaciones_personaje
    `);
    await queryRunner.query(`
      ALTER TABLE expediciones.participaciones
      DROP COLUMN personaje_id
    `);

    // 4. Drop personajes table
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.personajes`);

    // 5. Re-add rol column to usuarios
    await queryRunner.query(`
      ALTER TABLE expediciones.usuarios
      ADD COLUMN rol expediciones.rol_usuario NOT NULL DEFAULT 'player'
    `);

    // 6. Migrate roles back (take first role found)
    await queryRunner.query(`
      UPDATE expediciones.usuarios u
      SET rol = (
        SELECT rol FROM expediciones.usuario_roles ur
        WHERE ur.usuario_id = u.discord_id
        LIMIT 1
      )
      WHERE EXISTS (
        SELECT 1 FROM expediciones.usuario_roles ur
        WHERE ur.usuario_id = u.discord_id
      )
    `);

    // 7. Drop usuario_roles table
    await queryRunner.query(`DROP TABLE IF EXISTS expediciones.usuario_roles`);

    // 8. Re-add NOT NULL to password_hash
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
