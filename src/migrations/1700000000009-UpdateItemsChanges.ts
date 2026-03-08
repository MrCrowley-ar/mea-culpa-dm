import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateItemsChanges1700000000009 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Piso 3 Jefe: Eliminar "Bolsa de Monedas Impresionante" (tirada 6)
    await queryRunner.query(`
      DELETE FROM expediciones.tabla_items_boss
      WHERE piso_numero = 3
        AND item_id = (SELECT id FROM expediciones.items WHERE nombre = 'Bolsa de Monedas Impresionante' LIMIT 1)
    `);

    // Eliminar el item si no se usa en ningún otro lado
    await queryRunner.query(`
      DELETE FROM expediciones.items
      WHERE nombre = 'Bolsa de Monedas Impresionante'
        AND id NOT IN (SELECT item_id FROM expediciones.tabla_items_boss)
        AND id NOT IN (SELECT item_id FROM expediciones.tabla_critico)
    `);

    // 2. Amuleto del Protagonista: Agregar descripciones de evoluciones
    await queryRunner.query(`
      UPDATE expediciones.items
      SET descripcion = 'Declarar protagonista + matar 2 rojos en 5 turnos = invulnerable 2 turnos. Evolución corrupta (PK): matar jugador → Amuleto del Antagonista, declarar antagonista en PvP = invulnerable 1 turno + cada kill da otro turno invulnerable. Evolución party muere: aliado derribado frente a ti cuenta como carga de enemigo rojo. Evolución matar jefe: declarar prota + dar último golpe al boss = daño adicional fijo = competencia + inmune estados alterados en sala bonus/jefe'
      WHERE nombre = 'Amuleto del Protagonista'
    `);

    // 3. Piedra luminosa: Eliminar de loot especial Tier 1 (pisos 1-4)
    // Actualizar la descripción de recompensas para roll 20 quitando Piedra luminosa
    await queryRunner.query(`
      UPDATE expediciones.tabla_recompensas
      SET descripcion = 'Objeto mágico menor: Anillo +1/Amuleto chispa (20g+)'
      WHERE piso_numero IN (1, 2, 3, 4)
        AND rango_min = 20 AND rango_max = 20
        AND descripcion LIKE '%Piedra luminosa%'
    `);

    // Eliminar el item Piedra luminosa si no está referenciado en otras tablas
    await queryRunner.query(`
      DELETE FROM expediciones.items
      WHERE nombre = 'Piedra luminosa'
        AND id NOT IN (SELECT item_id FROM expediciones.tabla_items_boss)
        AND id NOT IN (SELECT item_id FROM expediciones.tabla_critico)
        AND id NOT IN (SELECT item_id FROM expediciones.tabla_armas)
        AND id NOT IN (SELECT item_id FROM expediciones.tabla_armaduras)
        AND id NOT IN (SELECT item_id FROM expediciones.tabla_objetos_curiosos)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restaurar Piedra luminosa
    await queryRunner.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable)
      VALUES ('Piedra luminosa', 'equipo', 20, 'Objeto mágico menor', false)
      ON CONFLICT DO NOTHING
    `);

    // Restaurar descripción recompensas Tier 1 roll 20
    await queryRunner.query(`
      UPDATE expediciones.tabla_recompensas
      SET descripcion = 'Objeto mágico menor: Piedra luminosa/Anillo +1/Amuleto chispa (20g+)'
      WHERE piso_numero IN (1, 2, 3, 4)
        AND rango_min = 20 AND rango_max = 20
        AND descripcion LIKE '%Anillo +1/Amuleto chispa%'
    `);

    // Restaurar descripción original del Amuleto del Protagonista
    await queryRunner.query(`
      UPDATE expediciones.items
      SET descripcion = 'Declarar protagonista + matar 2 rojos en 5 turnos = invulnerable 2 turnos'
      WHERE nombre = 'Amuleto del Protagonista'
    `);

    // Restaurar Bolsa de Monedas Impresionante
    await queryRunner.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable)
      VALUES ('Bolsa de Monedas Impresionante', 'otro', 100, '100 oros escarchados, enanos pagan hasta 90g', false)
      ON CONFLICT DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO expediciones.tabla_items_boss (piso_numero, tirada, item_id, variante)
      VALUES (3, 6, (SELECT id FROM expediciones.items WHERE nombre = 'Bolsa de Monedas Impresionante' LIMIT 1), NULL)
    `);
  }
}
