import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPiso8Data1700000000008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.seedBossItems(queryRunner);
    await this.seedCriticalItems(queryRunner);
    await this.seedTablaItemsBoss(queryRunner);
    await this.seedTablaCritico(queryRunner);
    await this.seedTablaRecompensas(queryRunner);
    await this.seedTablaEncuentros(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar encuentros piso 8
    await queryRunner.query(
      `DELETE FROM expediciones.tabla_encuentros WHERE piso_numero = 8`,
    );

    // Eliminar recompensas piso 8
    await queryRunner.query(
      `DELETE FROM expediciones.tabla_recompensas WHERE piso_numero = 8`,
    );

    // Eliminar tabla_critico piso 8
    await queryRunner.query(
      `DELETE FROM expediciones.tabla_critico WHERE piso_numero = 8`,
    );

    // Eliminar tabla_items_boss piso 8
    await queryRunner.query(
      `DELETE FROM expediciones.tabla_items_boss WHERE piso_numero = 8`,
    );

    // Eliminar items de piso 8
    await queryRunner.query(`
      DELETE FROM expediciones.items WHERE nombre IN (
        'Motosierra de Muñeca Espantosa',
        'Pistola de Clavos',
        'Bastón del Maestro de las Muñecas',
        'Vestido de Muñeca Espantosa',
        'Guadaña de Muñeca Espantosa',
        'Engranajes de Muñeca Espantosa',
        'Brazo Mecánico',
        'Pierna Mecánica',
        'Núcleo de Muñeca Espantosa',
        'Tocado de Muñeca Espantosa'
      )
    `);
  }

  // ================================================================
  // ITEMS DE JEFE - PISO 8 (Muñecas Espantosas)
  // ================================================================
  private async seedBossItems(qr: QueryRunner): Promise<void> {
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable) VALUES
        ('Motosierra de Muñeca Espantosa', 'arma', 90, 'Espadón +2, elegir daño necro/cortante, crítico +2d6 y pierde movimiento, crítico a jugador CD 15 CON o desmembrado', false),
        ('Pistola de Clavos', 'arma', 90, 'Pistola +2, elegir daño necro/perforante, al golpear el objetivo pierde 10 pies movimiento 1 turno', false),
        ('Bastón del Maestro de las Muñecas', 'arma', 90, 'Bastón +2, foco arcano +2 conjuros y +1 CD, elegir necro/contundente, adicional: hilos 60 pies desplazan aliado 10 pies, constructo/prótesis = ataque extra', false),
        ('Vestido de Muñeca Espantosa', 'armadura', 90, 'Placas, al recibir 10+ daño recupera 1d4 vida, 1/día aura pesadilla: daño necro recupera 1d6 vida', false),
        ('Guadaña de Muñeca Espantosa', 'arma', 90, 'Espada larga +2, elegir necro/cortante, si objetivo herido +1d4 e impide curación, crítico a jugador CD 15 CON o desmembrado', false),
        ('Engranajes de Muñeca Espantosa', 'material', 90, 'Material para artífice', false)
    `);
  }

  // ================================================================
  // ITEMS CRÍTICOS - PISO 8
  // ================================================================
  private async seedCriticalItems(qr: QueryRunner): Promise<void> {
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable) VALUES
        ('Brazo Mecánico', 'equipo', 45, 'Prótesis (resistencia 10): cambiar arma 1/turno sin acción, -2 daño melee', false),
        ('Pierna Mecánica', 'equipo', 45, 'Prótesis (resistencia 10): adicional +15 pies movimiento en turno, -5 pies base', false),
        ('Núcleo de Muñeca Espantosa', 'equipo', 45, 'Núcleo constructo-pet: inicio sala 3xnivel vida temporal +2 CA, sirve como gema homúnculo', false),
        ('Tocado de Muñeca Espantosa', 'armadura', 45, 'Casco: daño necro +1d4 adicional, si es conjuro/truco +1d6 en su lugar', false)
    `);
  }

  // ================================================================
  // TABLA_ITEMS_BOSS - PISO 8
  // ================================================================
  private async seedTablaItemsBoss(qr: QueryRunner): Promise<void> {
    const bossItems = [
      'Motosierra de Muñeca Espantosa',
      'Pistola de Clavos',
      'Bastón del Maestro de las Muñecas',
      'Vestido de Muñeca Espantosa',
      'Guadaña de Muñeca Espantosa',
      'Engranajes de Muñeca Espantosa',
    ];

    for (let i = 0; i < bossItems.length; i++) {
      await qr.query(
        `
        INSERT INTO expediciones.tabla_items_boss (piso_numero, tirada, item_id, variante)
        VALUES ($1, $2, (SELECT id FROM expediciones.items WHERE nombre = $3 LIMIT 1), $4)
      `,
        [8, i + 1, bossItems[i], null],
      );
    }
  }

  // ================================================================
  // TABLA_CRITICO - PISO 8
  // ================================================================
  private async seedTablaCritico(qr: QueryRunner): Promise<void> {
    const criticoItems = [
      'Brazo Mecánico',
      'Pierna Mecánica',
      'Núcleo de Muñeca Espantosa',
      'Tocado de Muñeca Espantosa',
    ];

    for (let i = 0; i < criticoItems.length; i++) {
      await qr.query(
        `
        INSERT INTO expediciones.tabla_critico (piso_numero, tirada, item_id)
        VALUES ($1, $2, (SELECT id FROM expediciones.items WHERE nombre = $3 LIMIT 1))
      `,
        [8, i + 1, criticoItems[i]],
      );
    }
  }

  // ================================================================
  // TABLA_RECOMPENSAS - PISO 8 (misma estructura Tier 2 que pisos 5-7)
  // ================================================================
  private async seedTablaRecompensas(qr: QueryRunner): Promise<void> {
    const comunId = `(SELECT id FROM expediciones.tipos_habitacion WHERE nombre = 'comun')`;

    await qr.query(`
      INSERT INTO expediciones.tabla_recompensas
        (piso_numero, tipo_habitacion_id, rango_min, rango_max, tipo_resultado, dados_oro, subtabla_nombre, descripcion)
      VALUES
        (8, ${comunId}, 1, 5, 'oro', '2d4', NULL, '2d4 Obsidiana Roja (2g c/u)'),
        (8, ${comunId}, 6, 9, 'oro', '2d8', NULL, '2d8 Obsidiana Roja (2g c/u)'),
        (8, ${comunId}, 10, 12, 'oro', '4d6', NULL, '4d6 Obsidiana Roja (2g c/u)'),
        (8, ${comunId}, 13, 13, 'subtabla', NULL, 'armas', 'Arma +1'),
        (8, ${comunId}, 14, 14, 'subtabla', NULL, 'armaduras', 'Armadura +1 (ligera/media)'),
        (8, ${comunId}, 15, 15, 'subtabla', NULL, 'pociones', 'Pociones 1d4 tipos'),
        (8, ${comunId}, 16, 16, 'subtabla', NULL, 'especial', 'Aleación Tier 1 - Crafting artífice'),
        (8, ${comunId}, 17, 17, 'subtabla', NULL, 'especial', 'Ventaja dungeon 1d4: Mapa/Pergamino/Obsidiana/Repite'),
        (8, ${comunId}, 18, 18, 'subtabla', NULL, 'especial', 'Ración mágica grupal'),
        (8, ${comunId}, 19, 19, 'subtabla', NULL, 'especial', 'Bomba: 3d10 fuego, CD 12, 10ft cubo'),
        (8, ${comunId}, 20, 20, 'subtabla', NULL, 'critico', 'Tabla Crítico del piso (1d4)')
    `);
  }

  // ================================================================
  // TABLA_ENCUENTROS - PISO 8 (misma estructura Tier 2 que pisos 5-7)
  // ================================================================
  private async seedTablaEncuentros(qr: QueryRunner): Promise<void> {
    const comunId = `(SELECT id FROM expediciones.tipos_habitacion WHERE nombre = 'comun')`;
    const jefeId = `(SELECT id FROM expediciones.tipos_habitacion WHERE nombre = 'jefe')`;
    const bonusId = `(SELECT id FROM expediciones.tipos_habitacion WHERE nombre = 'bonus')`;

    // Sala Común
    await qr.query(`
      INSERT INTO expediciones.tabla_encuentros
        (piso_numero, tipo_habitacion_id, rango_min, rango_max, cantidad_total)
      VALUES
        (8, ${comunId}, 1, 5, 6),
        (8, ${comunId}, 6, 10, 8),
        (8, ${comunId}, 11, 19, 10),
        (8, ${comunId}, 20, 20, 14)
    `);

    // Sala Jefe y Bonus
    await qr.query(`
      INSERT INTO expediciones.tabla_encuentros
        (piso_numero, tipo_habitacion_id, rango_min, rango_max, cantidad_total)
      VALUES
        (8, ${jefeId}, 1, 5, 8),
        (8, ${jefeId}, 6, 10, 10),
        (8, ${jefeId}, 11, 19, 14),
        (8, ${jefeId}, 20, 20, 16),
        (8, ${bonusId}, 1, 5, 8),
        (8, ${bonusId}, 6, 10, 10),
        (8, ${bonusId}, 11, 19, 14),
        (8, ${bonusId}, 20, 20, 16)
    `);
  }
}
