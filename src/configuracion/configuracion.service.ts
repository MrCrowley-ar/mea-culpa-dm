import { Injectable } from '@nestjs/common';
import { NotFoundServiceException } from '../common/exceptions/service.exception';
import { TierRepository } from './repositories/tier.repository';
import { PisoRepository } from './repositories/piso.repository';
import { TipoHabitacionRepository } from './repositories/tipo-habitacion.repository';
import { ItemRepository } from './repositories/item.repository';
import { Tier } from './entities/tier.entity';
import { Piso } from './entities/piso.entity';
import { TipoHabitacion } from './entities/tipo-habitacion.entity';
import { Item } from './entities/item.entity';

@Injectable()
export class ConfiguracionService {
  constructor(
    private readonly tierRepo: TierRepository,
    private readonly pisoRepo: PisoRepository,
    private readonly tipoHabitacionRepo: TipoHabitacionRepository,
    private readonly itemRepo: ItemRepository,
  ) {}

  async getTiers(): Promise<Tier[]> {
    return this.tierRepo.findAll();
  }

  async getTier(id: number): Promise<Tier> {
    const tier = await this.tierRepo.findById(id);
    if (!tier) {
      throw new NotFoundServiceException(`Tier con ID ${id} no encontrado`);
    }
    return tier;
  }

  async getPisos(): Promise<Piso[]> {
    return this.pisoRepo.findAll();
  }

  async getPiso(numero: number): Promise<Piso> {
    const piso = await this.pisoRepo.findByNumero(numero);
    if (!piso) {
      throw new NotFoundServiceException(`Piso ${numero} no encontrado`);
    }
    return piso;
  }

  async getBonusRecompensa(pisoNumero: number): Promise<number> {
    const piso = await this.getPiso(pisoNumero);
    return piso.bonus_recompensa;
  }

  async getModArmas(pisoNumero: number): Promise<number> {
    const piso = await this.getPiso(pisoNumero);
    return piso.tier?.mod_armas ?? 0;
  }

  async getModArmaduras(pisoNumero: number): Promise<number> {
    const piso = await this.getPiso(pisoNumero);
    return piso.tier?.mod_armaduras ?? 0;
  }

  async getTiposHabitacion(): Promise<TipoHabitacion[]> {
    return this.tipoHabitacionRepo.findAll();
  }

  async getTipoHabitacionByNombre(nombre: string): Promise<TipoHabitacion> {
    const tipo = await this.tipoHabitacionRepo.findByNombre(nombre);
    if (!tipo) {
      throw new NotFoundServiceException(
        `Tipo de habitación "${nombre}" no encontrado`,
      );
    }
    return tipo;
  }

  async getTipoHabitacion(id: number): Promise<TipoHabitacion> {
    const tipo = await this.tipoHabitacionRepo.findById(id);
    if (!tipo) {
      throw new NotFoundServiceException(
        `Tipo de habitación con ID ${id} no encontrado`,
      );
    }
    return tipo;
  }

  async getItems(): Promise<Item[]> {
    return this.itemRepo.findAll();
  }

  async getItem(id: number): Promise<Item> {
    const item = await this.itemRepo.findById(id);
    if (!item) {
      throw new NotFoundServiceException(`Item con ID ${id} no encontrado`);
    }
    return item;
  }

  async createItem(data: Partial<Item>): Promise<Item> {
    return this.itemRepo.create(data);
  }

  async updateItem(id: number, data: Partial<Item>): Promise<Item> {
    await this.getItem(id);
    const updated = await this.itemRepo.update(id, data);
    if (!updated) {
      throw new NotFoundServiceException(`Item con ID ${id} no encontrado`);
    }
    return updated;
  }

  async deleteItem(id: number): Promise<void> {
    await this.getItem(id);
    await this.itemRepo.delete(id);
  }
}
