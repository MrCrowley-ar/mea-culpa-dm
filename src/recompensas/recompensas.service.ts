import { Injectable } from '@nestjs/common';
import { NotFoundServiceException } from '../common/exceptions/service.exception';
import { TablaRecompensaRepository } from './repositories/tabla-recompensa.repository';
import { TablaObjetosCuriososRepository } from './repositories/tabla-objetos-curiosos.repository';
import { TablaItemsBossRepository } from './repositories/tabla-items-boss.repository';
import { TablaArmaRepository } from './repositories/tabla-arma.repository';
import { TablaArmaduraRepository } from './repositories/tabla-armadura.repository';
import { TablaPocionRepository } from './repositories/tabla-pocion.repository';
import { TablaTesroMenorRepository } from './repositories/tabla-tesoro-menor.repository';
import { TablaCriticoRepository } from './repositories/tabla-critico.repository';
import { TablaRecompensa } from './entities/tabla-recompensa.entity';
import { TablaObjetosCuriosos } from './entities/tabla-objetos-curiosos.entity';
import { TablaItemsBoss } from './entities/tabla-items-boss.entity';
import { TablaArma } from './entities/tabla-arma.entity';
import { TablaArmadura } from './entities/tabla-armadura.entity';
import { TablaPocion } from './entities/tabla-pocion.entity';
import { TablaTesroMenor } from './entities/tabla-tesoro-menor.entity';
import { TablaCritico } from './entities/tabla-critico.entity';

@Injectable()
export class RecompensasService {
  constructor(
    private readonly tablaRecompensaRepo: TablaRecompensaRepository,
    private readonly tablaObjetosCuriososRepo: TablaObjetosCuriososRepository,
    private readonly tablaItemsBossRepo: TablaItemsBossRepository,
    private readonly tablaArmaRepo: TablaArmaRepository,
    private readonly tablaArmaduraRepo: TablaArmaduraRepository,
    private readonly tablaPocionRepo: TablaPocionRepository,
    private readonly tablaTesroMenorRepo: TablaTesroMenorRepository,
    private readonly tablaCriticoRepo: TablaCriticoRepository,
  ) {}

  // --- Tabla Recompensas ---
  async getTablaRecompensas(): Promise<TablaRecompensa[]> {
    return this.tablaRecompensaRepo.findAll();
  }
  async getTablaRecompensa(id: number): Promise<TablaRecompensa> {
    const r = await this.tablaRecompensaRepo.findById(id);
    if (!r) throw new NotFoundServiceException(`Tabla recompensa ID ${id} no encontrada`);
    return r;
  }
  async createTablaRecompensa(data: Partial<TablaRecompensa>): Promise<TablaRecompensa> {
    return this.tablaRecompensaRepo.create(data);
  }
  async updateTablaRecompensa(id: number, data: Partial<TablaRecompensa>): Promise<TablaRecompensa> {
    await this.getTablaRecompensa(id);
    const u = await this.tablaRecompensaRepo.update(id, data);
    if (!u) throw new NotFoundServiceException(`Tabla recompensa ID ${id} no encontrada`);
    return u;
  }
  async deleteTablaRecompensa(id: number): Promise<void> {
    await this.getTablaRecompensa(id);
    await this.tablaRecompensaRepo.delete(id);
  }

  // --- Objetos Curiosos ---
  async getTablaObjetosCuriosos(): Promise<TablaObjetosCuriosos[]> {
    return this.tablaObjetosCuriososRepo.findAll();
  }
  async createTablaObjetosCuriosos(data: Partial<TablaObjetosCuriosos>): Promise<TablaObjetosCuriosos> {
    return this.tablaObjetosCuriososRepo.create(data);
  }
  async deleteTablaObjetosCuriosos(id: number): Promise<void> {
    await this.tablaObjetosCuriososRepo.delete(id);
  }

  // --- Items Boss ---
  async getTablaItemsBoss(): Promise<TablaItemsBoss[]> {
    return this.tablaItemsBossRepo.findAll();
  }
  async createTablaItemsBoss(data: Partial<TablaItemsBoss>): Promise<TablaItemsBoss> {
    return this.tablaItemsBossRepo.create(data);
  }
  async deleteTablaItemsBoss(id: number): Promise<void> {
    await this.tablaItemsBossRepo.delete(id);
  }

  // --- Armas ---
  async getTablaArmas(): Promise<TablaArma[]> {
    return this.tablaArmaRepo.findAll();
  }
  async createTablaArma(data: Partial<TablaArma>): Promise<TablaArma> {
    return this.tablaArmaRepo.create(data);
  }
  async deleteTablaArma(id: number): Promise<void> {
    await this.tablaArmaRepo.delete(id);
  }

  // --- Armaduras ---
  async getTablaArmaduras(): Promise<TablaArmadura[]> {
    return this.tablaArmaduraRepo.findAll();
  }
  async createTablaArmadura(data: Partial<TablaArmadura>): Promise<TablaArmadura> {
    return this.tablaArmaduraRepo.create(data);
  }
  async deleteTablaArmadura(id: number): Promise<void> {
    await this.tablaArmaduraRepo.delete(id);
  }

  // --- Pociones ---
  async getTablaPociones(): Promise<TablaPocion[]> {
    return this.tablaPocionRepo.findAll();
  }
  async createTablaPocion(data: Partial<TablaPocion>): Promise<TablaPocion> {
    return this.tablaPocionRepo.create(data);
  }
  async deleteTablaPocion(id: number): Promise<void> {
    await this.tablaPocionRepo.delete(id);
  }

  // --- Tesoro Menor ---
  async getTablaTesroMenor(): Promise<TablaTesroMenor[]> {
    return this.tablaTesroMenorRepo.findAll();
  }
  async createTablaTesroMenor(data: Partial<TablaTesroMenor>): Promise<TablaTesroMenor> {
    return this.tablaTesroMenorRepo.create(data);
  }
  async deleteTablaTesroMenor(id: number): Promise<void> {
    await this.tablaTesroMenorRepo.delete(id);
  }

  // --- Critico ---
  async getTablaCritico(): Promise<TablaCritico[]> {
    return this.tablaCriticoRepo.findAll();
  }
  async createTablaCritico(data: Partial<TablaCritico>): Promise<TablaCritico> {
    return this.tablaCriticoRepo.create(data);
  }
  async deleteTablaCritico(id: number): Promise<void> {
    await this.tablaCriticoRepo.delete(id);
  }
}
