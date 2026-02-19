import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOpcionesEspeciales1700000000006
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create missing items needed by especial options
    await queryRunner.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable)
      VALUES
        ('Mapa del dungeon', 'otro', 10, 'Mapa útil para navegación en dungeon', false),
        ('Obsidiana Roja', 'material', 2, 'Material valioso, moneda alternativa en pisos altos', false)
    `);

    // 2. Create opciones_especiales table with item_id FK
    await queryRunner.query(`
      CREATE TABLE expediciones.opciones_especiales (
        id SERIAL PRIMARY KEY,
        tabla_recompensa_id INT NOT NULL
          REFERENCES expediciones.tabla_recompensas(id) ON DELETE CASCADE,
        item_id INT NOT NULL
          REFERENCES expediciones.items(id)
      )
    `);

    // 3. Populate opciones for each especial entry
    // Helper: find tabla_recompensa by piso + rango + subtabla_nombre='especial'
    // Helper: find item by nombre

    // --- Tier 1 (Pisos 1-4): tirada 17 = Poción de fortuna (single item) ---
    await queryRunner.query(`
      INSERT INTO expediciones.opciones_especiales (tabla_recompensa_id, item_id)
      SELECT tr.id, i.id
      FROM expediciones.tabla_recompensas tr, expediciones.items i
      WHERE tr.subtabla_nombre = 'especial'
        AND tr.rango_min = 17 AND tr.rango_max = 17
        AND tr.piso_numero IN (1,2,3,4)
        AND i.nombre = 'Poción de fortuna'
    `);

    // --- Tier 1 (Pisos 1-4): tirada 18 = Saco de raciones (single item) ---
    await queryRunner.query(`
      INSERT INTO expediciones.opciones_especiales (tabla_recompensa_id, item_id)
      SELECT tr.id, i.id
      FROM expediciones.tabla_recompensas tr, expediciones.items i
      WHERE tr.subtabla_nombre = 'especial'
        AND tr.rango_min = 18 AND tr.rango_max = 18
        AND tr.piso_numero IN (1,2,3,4)
        AND i.nombre = 'Saco de raciones'
    `);

    // --- Tier 1 (Pisos 1-4): tirada 19 = Equipo raro: Pergamino/Mapa/Gemas ---
    // (skip "Repite" - not a real item, random pick handles re-roll)
    const equipoRaroItems = [
      'Pergamino viejo con runas ilegibles',
      'Mapa del dungeon',
      'Gemas varias',
    ];
    for (const itemNombre of equipoRaroItems) {
      await queryRunner.query(`
        INSERT INTO expediciones.opciones_especiales (tabla_recompensa_id, item_id)
        SELECT tr.id, i.id
        FROM expediciones.tabla_recompensas tr, expediciones.items i
        WHERE tr.subtabla_nombre = 'especial'
          AND tr.rango_min = 19 AND tr.rango_max = 19
          AND tr.piso_numero IN (1,2,3,4)
          AND i.nombre = '${itemNombre}'
      `);
    }

    // --- Tier 1 (Pisos 1-4): tirada 20 = Objeto mágico menor: Piedra luminosa/Anillo +1/Amuleto chispa ---
    const objetoMagicoItems = [
      'Piedra luminosa',
      'Anillo +1 (menor)',
      'Amuleto chispa (menor)',
    ];
    for (const itemNombre of objetoMagicoItems) {
      await queryRunner.query(`
        INSERT INTO expediciones.opciones_especiales (tabla_recompensa_id, item_id)
        SELECT tr.id, i.id
        FROM expediciones.tabla_recompensas tr, expediciones.items i
        WHERE tr.subtabla_nombre = 'especial'
          AND tr.rango_min = 20 AND tr.rango_max = 20
          AND tr.piso_numero IN (1,2,3,4)
          AND i.nombre = '${itemNombre}'
      `);
    }

    // --- Tier 2 (Pisos 5-7): tirada 16 = Aleación Tier 1 (single item) ---
    await queryRunner.query(`
      INSERT INTO expediciones.opciones_especiales (tabla_recompensa_id, item_id)
      SELECT tr.id, i.id
      FROM expediciones.tabla_recompensas tr, expediciones.items i
      WHERE tr.subtabla_nombre = 'especial'
        AND tr.rango_min = 16 AND tr.rango_max = 16
        AND tr.piso_numero IN (5,6,7)
        AND i.nombre = 'Aleación Tier 1'
    `);

    // --- Tier 2 (Pisos 5-7): tirada 17 = Ventaja dungeon: Mapa/Pergamino/Obsidiana ---
    const ventajaDungeonItems = [
      'Mapa del dungeon',
      'Pergamino viejo con runas ilegibles',
      'Obsidiana Roja',
    ];
    for (const itemNombre of ventajaDungeonItems) {
      await queryRunner.query(`
        INSERT INTO expediciones.opciones_especiales (tabla_recompensa_id, item_id)
        SELECT tr.id, i.id
        FROM expediciones.tabla_recompensas tr, expediciones.items i
        WHERE tr.subtabla_nombre = 'especial'
          AND tr.rango_min = 17 AND tr.rango_max = 17
          AND tr.piso_numero IN (5,6,7)
          AND i.nombre = '${itemNombre}'
      `);
    }

    // --- Tier 2 (Pisos 5-7): tirada 18 = Ración mágica grupal (single item) ---
    await queryRunner.query(`
      INSERT INTO expediciones.opciones_especiales (tabla_recompensa_id, item_id)
      SELECT tr.id, i.id
      FROM expediciones.tabla_recompensas tr, expediciones.items i
      WHERE tr.subtabla_nombre = 'especial'
        AND tr.rango_min = 18 AND tr.rango_max = 18
        AND tr.piso_numero IN (5,6,7)
        AND i.nombre = 'Ración mágica grupal'
    `);

    // --- Tier 2 (Pisos 5-7): tirada 19 = Bomba (single item) ---
    await queryRunner.query(`
      INSERT INTO expediciones.opciones_especiales (tabla_recompensa_id, item_id)
      SELECT tr.id, i.id
      FROM expediciones.tabla_recompensas tr, expediciones.items i
      WHERE tr.subtabla_nombre = 'especial'
        AND tr.rango_min = 19 AND tr.rango_max = 19
        AND tr.piso_numero IN (5,6,7)
        AND i.nombre = 'Bomba'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS expediciones.opciones_especiales`,
    );

    // Remove items created by this migration
    await queryRunner.query(`
      DELETE FROM expediciones.items
      WHERE nombre IN ('Mapa del dungeon', 'Obsidiana Roja')
    `);
  }
}
