import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedGameData1700000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.updatePisosMod(queryRunner);
    await this.seedWeaponItems(queryRunner);
    await this.seedArmorItems(queryRunner);
    await this.seedCuriousItems(queryRunner);
    await this.seedSpecialLootItems(queryRunner);
    await this.seedBossItems(queryRunner);
    await this.seedCriticalItems(queryRunner);
    await this.seedTablaArmas(queryRunner);
    await this.seedTablaArmaduras(queryRunner);
    await this.seedTablaObjetosCuriosos(queryRunner);
    await this.seedTablaRecompensas(queryRunner);
    await this.seedTablaItemsBoss(queryRunner);
    await this.seedTablaCritico(queryRunner);
    await this.seedEncuentros(queryRunner);
    await this.seedEventosBonus(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM expediciones.tabla_eventos_bonus`);
    await queryRunner.query(`DELETE FROM expediciones.encuentro_enemigos`);
    await queryRunner.query(`DELETE FROM expediciones.tabla_encuentros`);
    await queryRunner.query(`DELETE FROM expediciones.tipos_enemigo`);
    await queryRunner.query(`DELETE FROM expediciones.tabla_critico`);
    await queryRunner.query(`DELETE FROM expediciones.tabla_items_boss`);
    await queryRunner.query(`DELETE FROM expediciones.tabla_recompensas`);
    await queryRunner.query(`DELETE FROM expediciones.tabla_objetos_curiosos`);
    await queryRunner.query(`DELETE FROM expediciones.tabla_armaduras`);
    await queryRunner.query(`DELETE FROM expediciones.tabla_armas`);
    await queryRunner.query(`DELETE FROM expediciones.items`);
    await queryRunner.query(`UPDATE expediciones.pisos SET mod_encuentro = 0`);
  }

  // ================================================================
  // 1. UPDATE PISOS MOD_ENCUENTRO
  // ================================================================
  private async updatePisosMod(qr: QueryRunner): Promise<void> {
    await qr.query(`
      UPDATE expediciones.pisos SET mod_encuentro = CASE numero
        WHEN 1 THEN 0
        WHEN 2 THEN 3
        WHEN 3 THEN 4
        WHEN 4 THEN 5
        WHEN 5 THEN 0
        WHEN 6 THEN 2
        ELSE 0
      END
    `);
  }

  // ================================================================
  // 2. SEED ITEMS
  // ================================================================
  private async seedWeaponItems(qr: QueryRunner): Promise<void> {
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable) VALUES
        ('Daga', 'arma', 3, 'Simple', true),
        ('Cimitarra', 'arma', 8, 'Marcial', true),
        ('Espada corta', 'arma', 8, 'Marcial', true),
        ('Espada larga', 'arma', 15, 'Marcial', true),
        ('Espadón (gran espada)', 'arma', 25, 'Marcial', true),
        ('Hacha de mano', 'arma', 5, 'Simple', true),
        ('Hacha de batalla', 'arma', 13, 'Marcial', true),
        ('Gran hacha', 'arma', 23, 'Marcial', true),
        ('Maza', 'arma', 8, 'Simple', true),
        ('Martillo de guerra', 'arma', 15, 'Marcial', true),
        ('Martillo ligero', 'arma', 5, 'Simple', true),
        ('Lanza', 'arma', 3, 'Simple', true),
        ('Jabalinas (x3)', 'arma', 5, 'Simple', true),
        ('Tridente', 'arma', 10, 'Marcial', true),
        ('Estoque', 'arma', 15, 'Marcial', true),
        ('Carcaj', 'arma', 13, 'Munición. Si ya tiene arco corto, obtiene arco corto', true),
        ('Arco corto', 'arma', 13, 'Simple. Incluye 10 flechas', true),
        ('Arco largo', 'arma', 25, 'Marcial. Incluye 10 flechas', true),
        ('Ballesta ligera', 'arma', 15, 'Simple', true),
        ('Espadón +1', 'arma', 30, 'Marcial Mágica', false)
    `);
  }

  private async seedArmorItems(qr: QueryRunner): Promise<void> {
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable) VALUES
        ('Acolchada', 'armadura', 5, 'Ligera', true),
        ('Cuero', 'armadura', 8, 'Ligera', true),
        ('Cuero tachonado', 'armadura', 13, 'Ligera', true),
        ('Cuero tachonado alta calidad', 'armadura', 15, 'Ligera. +1 sigilo', false),
        ('Armadura de pieles', 'armadura', 10, 'Media', true),
        ('Coraza', 'armadura', 25, 'Media', true),
        ('Camisa de malla', 'armadura', 30, 'Media', true),
        ('Armadura de escamas', 'armadura', 40, 'Media', true),
        ('Armadura escamas negras', 'armadura', 50, 'Media. +1 CA', false),
        ('Cota Guarnecida', 'armadura', 75, 'Media', true),
        ('Cota de malla', 'armadura', 125, 'Pesada', true),
        ('Capa de movilidad', 'armadura', 8, 'Capa. +5 pies movimiento', false),
        ('Escudo de madera', 'armadura', 5, 'Escudo. +2 CA', true),
        ('Escudo metálico', 'armadura', 13, 'Escudo. +2 CA', true),
        ('Escudo de Torre', 'armadura', 20, 'Escudo. +2 CA', true),
        ('Casco simple (cuero)', 'armadura', 5, 'Casco. +1 Salvación DES', false),
        ('Casco simple (metal)', 'armadura', 5, 'Casco. +1 Salvación FUE', false),
        ('Casco reforzado', 'armadura', 13, 'Casco. +1 Salvación CON (req. armadura media)', false),
        ('Guantes cuero tachonado', 'armadura', 8, 'Guantes. +1 juego de manos', false),
        ('Grebas de hierro', 'armadura', 10, 'Grebas. +1 Salvación FUE (req. armadura pesada)', false),
        ('Armadura de placas', 'armadura', 100, 'Pesada', true)
    `);
  }

  private async seedCuriousItems(qr: QueryRunner): Promise<void> {
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, dados_precio, descripcion, es_base_modificable) VALUES
        ('Collar de cobre simple', 'otro', 5, NULL, NULL, false),
        ('Sortija de hierro oxidada', 'otro', 3, NULL, NULL, false),
        ('Bolsa gemas diminutas (cuarzo)', 'otro', 10, NULL, NULL, false),
        ('Amuleto de hueso tallado', 'otro', 8, NULL, NULL, false),
        ('Trozo de tela élfica resistente', 'otro', 12, NULL, NULL, false),
        ('Garra de bestia montada en plata', 'otro', 15, NULL, NULL, false),
        ('Bolsa especias raras', 'otro', 20, NULL, 'Azafrán, hierbas', false),
        ('Pergamino viejo con runas ilegibles', 'otro', 8, NULL, NULL, false),
        ('Estatuilla de barro sagrado (rota)', 'otro', 6, NULL, NULL, false),
        ('Moneda antigua (coleccionable)', 'otro', 15, NULL, NULL, false),
        ('Copa de bronce golpeada', 'otro', 10, NULL, NULL, false),
        ('Pequeño cofre bisagras oxidadas', 'otro', 12, NULL, NULL, false),
        ('Piedra mágica apagada (sin poder)', 'otro', 20, NULL, NULL, false),
        ('Perla pequeña', 'otro', 25, NULL, NULL, false),
        ('Lingote de plata', 'otro', 40, NULL, NULL, false),
        ('Collar con rubí diminuto', 'otro', 50, NULL, NULL, false),
        ('Máscara ceremonial de madera', 'otro', 15, NULL, NULL, false),
        ('Botella de vino añejo', 'otro', 30, NULL, NULL, false),
        ('Corona rota de hierro', 'otro', 20, NULL, NULL, false),
        ('Reliquia enigmática', 'otro', NULL, '1d20x5', NULL, false)
    `);
  }

  private async seedSpecialLootItems(qr: QueryRunner): Promise<void> {
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable) VALUES
        ('Poción de fortuna', 'consumible', 10, '50% curación 1d4+1 / 50% velocidad', false),
        ('Saco de raciones', 'consumible', 50, '1 ración. Muy valioso', false),
        ('Piedra luminosa', 'equipo', 20, 'Objeto mágico menor', false),
        ('Anillo +1 (menor)', 'equipo', 20, 'Objeto mágico menor', false),
        ('Amuleto chispa (menor)', 'equipo', 20, 'Objeto mágico menor', false),
        ('Bomba', 'consumible', 30, '3d10 fuego, CD 12, 10ft cubo', false),
        ('Ración mágica grupal', 'consumible', 40, 'Ración que beneficia a todo el grupo', false),
        ('Aleación Tier 1', 'material', 25, 'Crafting artífice', false)
    `);
  }

  private async seedBossItems(qr: QueryRunner): Promise<void> {
    // Piso 1 - Gemelos/Hermanos
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable) VALUES
        ('Hachas Gemelas de los Hermanos', 'arma', 20, '2x Hacha de mano +1, +1 daño adicional si dual wield', false),
        ('Amuleto de Sangre Compartida', 'equipo', 20, '1/día dividir 50% daño con aliado a 30 pies', false),
        ('Cinturón de Fuerza Salvaje', 'equipo', 20, '+2 pruebas de Fuerza, 1/expedición', false),
        ('Bolsa de Monedas Negras', 'otro', 50, '50 oros', false),
        ('Tatuaje de los Gemelos', 'equipo', 20, 'Relanzar ataque fallido 1/día, límite 1 por persona', false),
        ('Fragmento del Nexo', 'consumible', 75, '1 uso: revivir aliado con 1 PV, o vender por 75g', false)
    `);

    // Piso 2 - Arena/Desierto/Orcos
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable) VALUES
        ('Mandíbula del Coloso', 'equipo', 30, '+1 ataque melee bajo 50% HP, rugido CD 12 SAB al caer', false),
        ('Hacha de Cráneo Roto', 'arma', 30, 'Hacha 2 manos +1, crítico aturde CD 13 CON', false),
        ('Cuerno del Laberinto Perdido', 'equipo', 30, '1/día ventaja ataques melee 1 min, +1 cansancio, saber salida', false),
        ('Sandalias del Errante', 'armadura', 30, '+10 pies velocidad, ignorar terreno difícil arena/piedra, +1 CA si inmóvil', false),
        ('Foco del Nigromante de Arena', 'equipo', 30, '+1 daño necro/fuego, 1/día animar esqueleto 1 min', false),
        ('Piedra del Juicio del Minotauro', 'equipo', 30, 'Absorber almas (máx 3), gastar para repetir tirada, máx 10 usos', false)
    `);

    // Piso 3 - Hielo/Licántropo
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable) VALUES
        ('Garras de Hielo del Licántropo', 'arma', 40, 'Garras mágicas 1d6, 1/día +1d4 frío', false),
        ('Capa Invernal de la Luna Roja', 'armadura', 40, 'Resistencia frío, 1/expedición invisible 1 turno', false),
        ('Colmillo Helado', 'material', 40, 'Incrustar en arma: +1 daño frío permanente', false),
        ('Fragmento de Hielo Eterno', 'consumible', 80, 'Área escarcha 3m (velocidad -50% 1 min) o vender 80g', false),
        ('Amuleto de Instinto Salvaje', 'equipo', 40, '1/día actuar primero en combate (iniciativa máxima)', false),
        ('Bolsa de Monedas Impresionante', 'otro', 100, '100 oros escarchados, enanos pagan hasta 90g', false)
    `);

    // Piso 4 - Infernal/Demonios
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable) VALUES
        ('Botas de Salto Fásico', 'armadura', 50, '1/descanso corto: teletransporte 15 pies, estela da desventaja', false),
        ('Colmillo Ígneo del Sabueso Infernal', 'arma', 50, 'Primer ataque +1d6 fuego, CD 12 CON fallo = +3d6', false),
        ('Alas Espectrales', 'equipo', 50, '1/descanso corto: 20 pies + 2d8 necro a 5 pies, acción adicional', false),
        ('Mangual Barbed Demon', 'arma', 50, '+1, CD 12 SAB o desventaja, +1d4 radiante vs demonios', false),
        ('Capa de Seda Tenebrosa', 'armadura', 50, '1/descanso largo: inmunidad necro + invisible 1 turno', false),
        ('Corazón Encadenado de la Súcubo', 'equipo', 50, '1/largo: CD 13 SAB, desventaja + robar 3d6 vida, zombie si mata', false)
    `);

    // Piso 5 - Héroe/Monje
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable) VALUES
        ('Vendas de Knuckles', 'armadura', 60, 'Casco: +1 CA sin armadura', false),
        ('Collar de Potencial Liberado', 'equipo', 60, 'En crítico: 1d20+DES, 18+ = otro ataque (repetir), fallo = cansancio', false),
        ('Grebas Ultra Pesadas', 'armadura', 60, 'No volar/teletransportar, reacción +1d4+2 CA vs melee, 1/corto', false),
        ('Mosquete Personalizado', 'arma', 60, 'Mejorable en tienda artífices', false),
        ('Armadura del Letargo', 'armadura', 60, 'Acolchada +2, 1/corto meditar = 2d8 vida (concentración)', false),
        ('Amuleto del Protagonista', 'equipo', 60, 'Declarar protagonista + matar 2 rojos en 5 turnos = invulnerable 2 turnos', false)
    `);

    // Piso 6 Inquisidora
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable) VALUES
        ('Espada del Voto Irrompible', 'arma', 70, 'Espada larga +2, segundo ataque +1d6 radiante, fallo = ventaja siguiente', false),
        ('Armadura de la Agonía Envuelta', 'armadura', 70, 'Escamas +1 CA, 3 turnos atacante melee recibe 1d12 radiante', false),
        ('Yelmo del Ojo Sagrado', 'armadura', 70, '3/expedición: +3 ataque armas fuego, fallo = daño a aliado o a ti', false),
        ('Cadenas del Juramento Inquebrantable', 'armadura', 70, 'Guantes: +1 daño melee, no ser desarmado, +1d4 con Cadenas Condena', false),
        ('Rosario de la Devoción Ciega', 'equipo', 70, '-3 ataque conjuro = +5 daño fijo (un objetivo)', false),
        ('Reliquia del Último Mandato', 'equipo', 70, 'Todo daño hechizo = radiante, hechizos radiantes +2d6 (corrompe si PK)', false)
    `);

    // Piso 6 Penitente
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable) VALUES
        ('Espina del Martirio Silente', 'arma', 70, 'Daga +2, +1d6 necro si atacas tras recibir daño esta ronda', false),
        ('Capucha del Silencio Devoto', 'armadura', 70, 'Sin magia un turno = siguiente conjuro +2d6 (4d6 crítico)', false),
        ('Cadenas de Condena', 'arma', 70, 'Manoplas dual +2, 1d8 necro, no permite otra arma/escudo', false),
        ('Rosario de Lágrimas Encarnadas', 'equipo', 70, 'Recibir +50% daño (verdadero) = infligir 100% en siguiente ataque', false),
        ('Pecho del Flagelante', 'armadura', 70, 'Tachonada +1, 1/corto crítico asegurado = 50% daño verdadero a ti', false),
        ('Reliquia del Último Aliento', 'arma', 70, 'Espadón +2, en hit 1d20+FUE 15+ = atacar otra vez hasta fallar, te atacas', false)
    `);

    // Piso 7 - Enanos/Tecnología
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable) VALUES
        ('Jetpack', 'armadura', 80, 'Capa: volar = movimiento (armadura ligera/media), 4 usos y se destruye', false),
        ('Piedra Brillosa', 'equipo', 80, 'Foco arcano +1 (aumenta CD conjuros)', false),
        ('Guja Perfora Dragones', 'arma', 80, 'Guja +2, +1 daño por cada 3 CA sobre 18, +1 vs dragón/dracónido/kobold', false),
        ('Escudo de la Guardia Pesada', 'armadura', 80, 'Escudo +2 (req FUE 16, no volar), acción = cobertura media aliados + 6 temp HP', false),
        ('Balistita', 'arma', 80, 'Ballesta pesada +2, impacto empuja 10 pies a ambos, no empuje = 1d6 a ti', false),
        ('Martillo al Rojo Vivo', 'arma', 80, '2d6 (1d6 contund + 1d6 fuego), crítico en 1er ataque = daño extra, si no apaga', false)
    `);
  }

  private async seedCriticalItems(qr: QueryRunner): Promise<void> {
    // Piso 1
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, dados_precio, descripcion, es_base_modificable) VALUES
        ('Sombrero de copa elegante', 'equipo', 10, NULL, 'Solo bardo: inspiración cura CAR+competencia. Compra: 20g', false),
        ('Anillo de magia +1', 'equipo', 10, NULL, '+1 ataque de conjuro', false),
        ('Amuleto de chispa', 'equipo', 10, NULL, '+1 próxima tirada de ataque', false),
        ('Gemas varias', 'otro', NULL, '3d8', 'Cada gema vale 5g', false)
    `);

    // Piso 2
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable) VALUES
        ('Anillo del Sol Agrietado', 'equipo', 20, '+1 daño fuego melee con sol/calor, sin desventaja tormenta arena', false),
        ('Hacha de Arena Roja', 'arma', 20, 'Hacha mano +1, herida abrasiva +1 daño siguiente turno (acumulable)', false),
        ('Amuleto del Chamán Polvoriento', 'equipo', 20, '1/día conjuro +1d4 fuego, si ya es fuego = desventaja salvación', false),
        ('Guanteletes del Quebrarrocas', 'armadura', 20, '+1 daño desarmado/armas simples melee', false)
    `);

    // Piso 3
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable) VALUES
        ('Anillo del Vaho', 'equipo', 30, 'Respirar sin dificultad en frío extremo', false),
        ('Guantes de Nieve Eterna', 'armadura', 30, 'No resbalar en hielo/nieve, 1/día bola de nieve', false),
        ('Broche de Lobo Blanco', 'equipo', 30, 'Ventaja ataque en piso 1 o 3', false),
        ('Linterna de Escarcha', 'equipo', 30, 'Luz fría, primera bestia hostil tiene desventaja', false)
    `);

    // Piso 4
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable) VALUES
        ('Daga de Seda Sombría', 'arma', 40, 'Daga +1, CD 8 CON o paralizado 1 turno', false),
        ('Anillo del Eco Sombrío', 'equipo', 40, '1/largo: teletransporte etéreo 15 pies como reacción', false),
        ('Armadura de Acero Infernal', 'armadura', 40, 'Resistencia fuego, 1/corto manos ardientes como adicional', false),
        ('Látigo del Deseo y la Ruina', 'arma', 40, 'Látigo +2, CD 14 CAR o no puede atacar al portador 2 turnos (solo PvE)', false)
    `);

    // Piso 5
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable) VALUES
        ('Boxer del Monje Errante', 'arma', 50, 'Nudilleras 1d6, 1/día reducir daño 1d10+nivel (solo monje)', false),
        ('Manto del Héroe', 'equipo', 50, 'Ignorar resistencias jefe piso 5 fase 2, se destruye, vender 50g', false),
        ('Alabarda de la Guardia Caída', 'arma', 50, 'Alabarda +1, +1d4 si aliado atacó mismo objetivo, 1/día +1 CA inmóvil', false),
        ('Anillo de la Última Muralla', 'equipo', 50, '+1 todas salvaciones, 1/día repetir con ventaja (fallo = doble efecto)', false)
    `);

    // Piso 6 (Penitente - solo este camino tiene items críticos)
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable) VALUES
        ('Poción de Furia Fanática', 'consumible', 60, '5 turnos: furia +2 daño, bárbaro acumula + resistencia radiante/necro', false),
        ('Fragmento Mea Culpa núcleo 2', 'arma', 60, 'Espada corta +1 para pets, +1d6 necro con ventaja', false),
        ('Rosario del Castigo Eterno', 'equipo', 60, '1/combate reacción: repetir ataque fallido (-1d4 vida), +1d6 rad/necro si impacta', false),
        ('Fragmento Mea Culpa núcleo 1', 'armadura', 60, 'Armadura escamas +1 para pets no-muertos', false)
    `);

    // Piso 7
    await qr.query(`
      INSERT INTO expediciones.items (nombre, tipo, precio_base, descripcion, es_base_modificable) VALUES
        ('Runa Enana de Fortaleza', 'consumible', 70, 'Consumible: reacción Escudo (no counterspell)', false),
        ('Fragmento Mea Culpa 1 (herraduras)', 'equipo', 70, '+1 ataque y daño monturas', false),
        ('Mirilla de Precisión', 'armadura', 70, 'Casco: ventaja ataque distancia si en altura', false),
        ('Fragmento Mea Culpa 2 (armadura equina)', 'armadura', 70, 'CA fija 16 montura (no aumentable)', false)
    `);
  }

  // ================================================================
  // 3. TABLA_ARMAS MAPPINGS
  // ================================================================
  private async seedTablaArmas(qr: QueryRunner): Promise<void> {
    const weapons = [
      [1, 'Daga'], [2, 'Cimitarra'], [3, 'Espada corta'], [4, 'Espada larga'],
      [5, 'Espadón (gran espada)'], [6, 'Hacha de mano'], [7, 'Hacha de batalla'],
      [8, 'Gran hacha'], [9, 'Maza'], [10, 'Martillo de guerra'],
      [11, 'Martillo ligero'], [12, 'Lanza'], [13, 'Jabalinas (x3)'],
      [14, 'Tridente'], [15, 'Estoque'], [16, 'Carcaj'],
      [17, 'Arco corto'], [18, 'Arco largo'], [19, 'Ballesta ligera'],
      [20, 'Espadón +1'],
    ];

    for (const [tirada, nombre] of weapons) {
      await qr.query(`
        INSERT INTO expediciones.tabla_armas (tirada, item_id)
        VALUES ($1, (SELECT id FROM expediciones.items WHERE nombre = $2 LIMIT 1))
      `, [tirada, nombre]);
    }
  }

  // ================================================================
  // 4. TABLA_ARMADURAS MAPPINGS
  // ================================================================
  private async seedTablaArmaduras(qr: QueryRunner): Promise<void> {
    const armors: [number, string, string | null][] = [
      [1, 'Acolchada', null], [2, 'Cuero', null], [3, 'Cuero tachonado', null],
      [4, 'Cuero tachonado alta calidad', null], [5, 'Armadura de pieles', null],
      [6, 'Coraza', null], [7, 'Camisa de malla', null],
      [8, 'Armadura de escamas', null], [9, 'Armadura escamas negras', null],
      [10, 'Cota Guarnecida', null], [11, 'Cota de malla', null],
      [12, 'Capa de movilidad', null], [13, 'Escudo de madera', null],
      [14, 'Escudo metálico', null], [15, 'Escudo de Torre', null],
      [16, 'Casco simple (cuero)', null], [16, 'Casco simple (metal)', null],
      [17, 'Casco reforzado', null], [18, 'Guantes cuero tachonado', null],
      [19, 'Grebas de hierro', null],
      [20, 'Armadura de placas', 'cofre'], [20, 'Cota de malla', 'loot'],
    ];

    for (const [tirada, nombre, contexto] of armors) {
      await qr.query(`
        INSERT INTO expediciones.tabla_armaduras (tirada, item_id, contexto)
        VALUES ($1, (SELECT id FROM expediciones.items WHERE nombre = $2 LIMIT 1), $3)
      `, [tirada, nombre, contexto]);
    }
  }

  // ================================================================
  // 5. TABLA_OBJETOS_CURIOSOS
  // ================================================================
  private async seedTablaObjetosCuriosos(qr: QueryRunner): Promise<void> {
    const objects = [
      [1, 'Collar de cobre simple'], [2, 'Sortija de hierro oxidada'],
      [3, 'Bolsa gemas diminutas (cuarzo)'], [4, 'Amuleto de hueso tallado'],
      [5, 'Trozo de tela élfica resistente'], [6, 'Garra de bestia montada en plata'],
      [7, 'Bolsa especias raras'], [8, 'Pergamino viejo con runas ilegibles'],
      [9, 'Estatuilla de barro sagrado (rota)'], [10, 'Moneda antigua (coleccionable)'],
      [11, 'Copa de bronce golpeada'], [12, 'Pequeño cofre bisagras oxidadas'],
      [13, 'Piedra mágica apagada (sin poder)'], [14, 'Perla pequeña'],
      [15, 'Lingote de plata'], [16, 'Collar con rubí diminuto'],
      [17, 'Máscara ceremonial de madera'], [18, 'Botella de vino añejo'],
      [19, 'Corona rota de hierro'], [20, 'Reliquia enigmática'],
    ];

    for (const [tirada, nombre] of objects) {
      await qr.query(`
        INSERT INTO expediciones.tabla_objetos_curiosos (piso_numero, tipo_habitacion_id, tirada, item_id)
        VALUES (NULL, NULL, $1, (SELECT id FROM expediciones.items WHERE nombre = $2 LIMIT 1))
      `, [tirada, nombre]);
    }
  }

  // ================================================================
  // 6. TABLA_RECOMPENSAS (General Loot)
  // ================================================================
  private async seedTablaRecompensas(qr: QueryRunner): Promise<void> {
    const comunId = `(SELECT id FROM expediciones.tipos_habitacion WHERE nombre = 'comun')`;

    // Tier 1: Pisos 1-4
    for (let piso = 1; piso <= 4; piso++) {
      await qr.query(`
        INSERT INTO expediciones.tabla_recompensas
          (piso_numero, tipo_habitacion_id, rango_min, rango_max, tipo_resultado, dados_oro, subtabla_nombre, descripcion)
        VALUES
          (${piso}, ${comunId}, 1, 5, 'nada', NULL, NULL, 'Nada'),
          (${piso}, ${comunId}, 6, 7, 'oro', '1d6', NULL, '1d6 oros'),
          (${piso}, ${comunId}, 8, 9, 'oro', '1d8', NULL, '1d8 oros'),
          (${piso}, ${comunId}, 10, 13, 'oro', '2d6', NULL, '2d6 oros'),
          (${piso}, ${comunId}, 14, 15, 'subtabla', NULL, 'armas', 'Arma usada'),
          (${piso}, ${comunId}, 16, 16, 'subtabla', NULL, 'botin_alternativo', 'Objeto curioso'),
          (${piso}, ${comunId}, 17, 17, 'subtabla', NULL, 'especial', 'Poción de fortuna: 50% curación 1d4+1 / 50% velocidad (10g)'),
          (${piso}, ${comunId}, 18, 18, 'subtabla', NULL, 'especial', 'Saco de raciones: 1 ración'),
          (${piso}, ${comunId}, 19, 19, 'subtabla', NULL, 'especial', 'Equipo raro 1d4: Pergamino/Mapa/Gemas/Repite'),
          (${piso}, ${comunId}, 20, 20, 'subtabla', NULL, 'especial', 'Objeto mágico menor: Piedra luminosa/Anillo +1/Amuleto chispa (20g+)')
      `);
    }

    // Tier 2: Pisos 5-7 (Obsidiana Roja)
    for (let piso = 5; piso <= 7; piso++) {
      await qr.query(`
        INSERT INTO expediciones.tabla_recompensas
          (piso_numero, tipo_habitacion_id, rango_min, rango_max, tipo_resultado, dados_oro, subtabla_nombre, descripcion)
        VALUES
          (${piso}, ${comunId}, 1, 5, 'oro', '2d4', NULL, '2d4 Obsidiana Roja (2g c/u)'),
          (${piso}, ${comunId}, 6, 9, 'oro', '2d8', NULL, '2d8 Obsidiana Roja (2g c/u)'),
          (${piso}, ${comunId}, 10, 12, 'oro', '4d6', NULL, '4d6 Obsidiana Roja (2g c/u)'),
          (${piso}, ${comunId}, 13, 13, 'subtabla', NULL, 'armas', 'Arma +1'),
          (${piso}, ${comunId}, 14, 14, 'subtabla', NULL, 'armaduras', 'Armadura +1 (ligera/media)'),
          (${piso}, ${comunId}, 15, 15, 'subtabla', NULL, 'pociones', 'Pociones 1d4 tipos'),
          (${piso}, ${comunId}, 16, 16, 'subtabla', NULL, 'especial', 'Aleación Tier 1 - Crafting artífice'),
          (${piso}, ${comunId}, 17, 17, 'subtabla', NULL, 'especial', 'Ventaja dungeon 1d4: Mapa/Pergamino/Obsidiana/Repite'),
          (${piso}, ${comunId}, 18, 18, 'subtabla', NULL, 'especial', 'Ración mágica grupal'),
          (${piso}, ${comunId}, 19, 19, 'subtabla', NULL, 'especial', 'Bomba: 3d10 fuego, CD 12, 10ft cubo'),
          (${piso}, ${comunId}, 20, 20, 'subtabla', NULL, 'critico', 'Tabla Crítico del piso (1d4)')
      `);
    }
  }

  // ================================================================
  // 7. TABLA_ITEMS_BOSS
  // ================================================================
  private async seedTablaItemsBoss(qr: QueryRunner): Promise<void> {
    const bossData: [number, string | null, string[]][] = [
      [1, null, [
        'Hachas Gemelas de los Hermanos', 'Amuleto de Sangre Compartida',
        'Cinturón de Fuerza Salvaje', 'Bolsa de Monedas Negras',
        'Tatuaje de los Gemelos', 'Fragmento del Nexo',
      ]],
      [2, null, [
        'Mandíbula del Coloso', 'Hacha de Cráneo Roto',
        'Cuerno del Laberinto Perdido', 'Sandalias del Errante',
        'Foco del Nigromante de Arena', 'Piedra del Juicio del Minotauro',
      ]],
      [3, null, [
        'Garras de Hielo del Licántropo', 'Capa Invernal de la Luna Roja',
        'Colmillo Helado', 'Fragmento de Hielo Eterno',
        'Amuleto de Instinto Salvaje', 'Bolsa de Monedas Impresionante',
      ]],
      [4, null, [
        'Botas de Salto Fásico', 'Colmillo Ígneo del Sabueso Infernal',
        'Alas Espectrales', 'Mangual Barbed Demon',
        'Capa de Seda Tenebrosa', 'Corazón Encadenado de la Súcubo',
      ]],
      [5, null, [
        'Vendas de Knuckles', 'Collar de Potencial Liberado',
        'Grebas Ultra Pesadas', 'Mosquete Personalizado',
        'Armadura del Letargo', 'Amuleto del Protagonista',
      ]],
      [6, 'inquisidora', [
        'Espada del Voto Irrompible', 'Armadura de la Agonía Envuelta',
        'Yelmo del Ojo Sagrado', 'Cadenas del Juramento Inquebrantable',
        'Rosario de la Devoción Ciega', 'Reliquia del Último Mandato',
      ]],
      [6, 'penitente', [
        'Espina del Martirio Silente', 'Capucha del Silencio Devoto',
        'Cadenas de Condena', 'Rosario de Lágrimas Encarnadas',
        'Pecho del Flagelante', 'Reliquia del Último Aliento',
      ]],
      [7, null, [
        'Jetpack', 'Piedra Brillosa',
        'Guja Perfora Dragones', 'Escudo de la Guardia Pesada',
        'Balistita', 'Martillo al Rojo Vivo',
      ]],
    ];

    for (const [piso, variante, items] of bossData) {
      for (let i = 0; i < items.length; i++) {
        await qr.query(`
          INSERT INTO expediciones.tabla_items_boss (piso_numero, tirada, item_id, variante)
          VALUES ($1, $2, (SELECT id FROM expediciones.items WHERE nombre = $3 LIMIT 1), $4)
        `, [piso, i + 1, items[i], variante]);
      }
    }
  }

  // ================================================================
  // 8. TABLA_CRITICO
  // ================================================================
  private async seedTablaCritico(qr: QueryRunner): Promise<void> {
    const criticoData: [number, string[]][] = [
      [1, ['Sombrero de copa elegante', 'Anillo de magia +1', 'Amuleto de chispa', 'Gemas varias']],
      [2, ['Anillo del Sol Agrietado', 'Hacha de Arena Roja', 'Amuleto del Chamán Polvoriento', 'Guanteletes del Quebrarrocas']],
      [3, ['Anillo del Vaho', 'Guantes de Nieve Eterna', 'Broche de Lobo Blanco', 'Linterna de Escarcha']],
      [4, ['Daga de Seda Sombría', 'Anillo del Eco Sombrío', 'Armadura de Acero Infernal', 'Látigo del Deseo y la Ruina']],
      [5, ['Boxer del Monje Errante', 'Manto del Héroe', 'Alabarda de la Guardia Caída', 'Anillo de la Última Muralla']],
      [6, ['Poción de Furia Fanática', 'Fragmento Mea Culpa núcleo 2', 'Rosario del Castigo Eterno', 'Fragmento Mea Culpa núcleo 1']],
      [7, ['Runa Enana de Fortaleza', 'Fragmento Mea Culpa 1 (herraduras)', 'Mirilla de Precisión', 'Fragmento Mea Culpa 2 (armadura equina)']],
    ];

    for (const [piso, items] of criticoData) {
      for (let i = 0; i < items.length; i++) {
        await qr.query(`
          INSERT INTO expediciones.tabla_critico (piso_numero, tirada, item_id)
          VALUES ($1, $2, (SELECT id FROM expediciones.items WHERE nombre = $3 LIMIT 1))
        `, [piso, i + 1, items[i]]);
      }
    }
  }

  // ================================================================
  // 9. ENCUENTROS (tipos_enemigo + tabla_encuentros)
  // ================================================================
  private async seedEncuentros(qr: QueryRunner): Promise<void> {
    // Tipos de enemigo (animales por piso)
    await qr.query(`
      INSERT INTO expediciones.tipos_enemigo (nombre, piso_id, descripcion) VALUES
        ('Cerdo', 1, 'Animal de piso 1'),
        ('Ciervo', 2, 'Animal de piso 2'),
        ('Ciervo', 3, 'Animal de piso 3'),
        ('Ciervo', 4, 'Animal de piso 4')
    `);

    const comunId = `(SELECT id FROM expediciones.tipos_habitacion WHERE nombre = 'comun')`;
    const jefeId = `(SELECT id FROM expediciones.tipos_habitacion WHERE nombre = 'jefe')`;
    const bonusId = `(SELECT id FROM expediciones.tipos_habitacion WHERE nombre = 'bonus')`;

    // Tier 1 (Pisos 1-4) - Sala Común
    for (let piso = 1; piso <= 4; piso++) {
      await qr.query(`
        INSERT INTO expediciones.tabla_encuentros
          (piso_numero, tipo_habitacion_id, rango_min, rango_max, cantidad_total)
        VALUES
          (${piso}, ${comunId}, 1, 2, 0),
          (${piso}, ${comunId}, 3, 3, 1),
          (${piso}, ${comunId}, 4, 8, 4),
          (${piso}, ${comunId}, 9, 14, 6),
          (${piso}, ${comunId}, 15, 19, 8),
          (${piso}, ${comunId}, 20, 20, 10)
      `);
    }

    // Tier 2 (Pisos 5-6) - Sala Común
    for (let piso = 5; piso <= 6; piso++) {
      await qr.query(`
        INSERT INTO expediciones.tabla_encuentros
          (piso_numero, tipo_habitacion_id, rango_min, rango_max, cantidad_total)
        VALUES
          (${piso}, ${comunId}, 1, 5, 6),
          (${piso}, ${comunId}, 6, 10, 8),
          (${piso}, ${comunId}, 11, 19, 10),
          (${piso}, ${comunId}, 20, 20, 14)
      `);
    }

    // Piso 7 - usa Tier 2 (asumimos mismos rangos)
    await qr.query(`
      INSERT INTO expediciones.tabla_encuentros
        (piso_numero, tipo_habitacion_id, rango_min, rango_max, cantidad_total)
      VALUES
        (7, ${comunId}, 1, 5, 6),
        (7, ${comunId}, 6, 10, 8),
        (7, ${comunId}, 11, 19, 10),
        (7, ${comunId}, 20, 20, 14)
    `);

    // Sala Bonus/Jefe - Tier 1 (Pisos 1-4)
    for (let piso = 1; piso <= 4; piso++) {
      await qr.query(`
        INSERT INTO expediciones.tabla_encuentros
          (piso_numero, tipo_habitacion_id, rango_min, rango_max, cantidad_total)
        VALUES
          (${piso}, ${jefeId}, 1, 10, 6),
          (${piso}, ${jefeId}, 11, 19, 10),
          (${piso}, ${jefeId}, 20, 20, 14),
          (${piso}, ${bonusId}, 1, 10, 6),
          (${piso}, ${bonusId}, 11, 19, 10),
          (${piso}, ${bonusId}, 20, 20, 14)
      `);
    }

    // Sala Bonus/Jefe - Tier 2 (Pisos 5-7)
    for (let piso = 5; piso <= 7; piso++) {
      await qr.query(`
        INSERT INTO expediciones.tabla_encuentros
          (piso_numero, tipo_habitacion_id, rango_min, rango_max, cantidad_total)
        VALUES
          (${piso}, ${jefeId}, 1, 5, 8),
          (${piso}, ${jefeId}, 6, 10, 10),
          (${piso}, ${jefeId}, 11, 19, 14),
          (${piso}, ${jefeId}, 20, 20, 16),
          (${piso}, ${bonusId}, 1, 5, 8),
          (${piso}, ${bonusId}, 6, 10, 10),
          (${piso}, ${bonusId}, 11, 19, 14),
          (${piso}, ${bonusId}, 20, 20, 16)
      `);
    }
  }

  // ================================================================
  // 10. TABLA_EVENTOS_BONUS
  // ================================================================
  private async seedEventosBonus(qr: QueryRunner): Promise<void> {
    await qr.query(`
      INSERT INTO expediciones.tabla_eventos_bonus
        (tier_numero, rango_min, rango_max, evento, detalles, recompensa)
      VALUES
        -- Tier 1
        (1, 1, 7, 'Sala de Cofre', 'Items normales', 'Arma o Armadura +1'),
        (1, 8, 14, 'Comerciante Ambulante', 'Vende armas marciales +1 a 75g (persuasión 17+ = 50g)', 'Compra'),
        (1, 15, 20, 'Aventureros Atacados', '2 aventureros incapacitados, 4 enemigos del piso superior', '1 cofre +1 por cada aventurero salvado'),
        -- Tier 2
        (2, 1, 7, 'Sala de Cofre', 'Items +2', 'Arma o Armadura +2'),
        (2, 8, 14, 'Comerciante Ambulante', 'Armas +2 y pergaminos niv 2 a 75g (persuasión 18+ = 50g)', 'Compra'),
        (2, 15, 20, 'Aventureros Atacados', 'Aventureros: 10 PV (piso 1-4) / 20 PV (piso 5-9)', '1 cofre +2 por cada aventurero salvado')
    `);
  }
}
