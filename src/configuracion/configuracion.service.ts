import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tier } from './entities/tier.entity';
import { Piso } from './entities/piso.entity';
import { TipoHabitacion } from './entities/tipo-habitacion.entity';
import { Item } from './entities/item.entity';

@Injectable()
export class ConfiguracionService {
  constructor(
    @InjectRepository(Tier)
    private readonly tierRepo: Repository<Tier>,
    @InjectRepository(Piso)
    private readonly pisoRepo: Repository<Piso>,
    @InjectRepository(TipoHabitacion)
    private readonly tipoHabitacionRepo: Repository<TipoHabitacion>,
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
  ) {}

  async getTiers(): Promise<Tier[]> {
    return this.tierRepo.find({ relations: ['pisos'], order: { numero: 'ASC' } });
  }

  async getPiso(numero: number): Promise<Piso | null> {
    return this.pisoRepo.findOne({
      where: { numero },
      relations: ['tier'],
    });
  }

  async getBonusRecompensa(pisoNumero: number): Promise<number> {
    const piso = await this.getPiso(pisoNumero);
    return piso?.bonus_recompensa ?? 0;
  }

  async getModArmas(pisoNumero: number): Promise<number> {
    const piso = await this.getPiso(pisoNumero);
    if (!piso) return 0;
    const tier = await this.tierRepo.findOne({ where: { id: piso.tier_id } });
    return tier?.mod_armas ?? 0;
  }

  async getModArmaduras(pisoNumero: number): Promise<number> {
    const piso = await this.getPiso(pisoNumero);
    if (!piso) return 0;
    const tier = await this.tierRepo.findOne({ where: { id: piso.tier_id } });
    return tier?.mod_armaduras ?? 0;
  }

  async getTiposHabitacion(): Promise<TipoHabitacion[]> {
    return this.tipoHabitacionRepo.find();
  }

  async getItems(): Promise<Item[]> {
    return this.itemRepo.find();
  }
}
